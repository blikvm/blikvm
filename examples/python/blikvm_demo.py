#!/usr/bin/env python3
"""BliKVM screenshot and HID demo. Python 3.10+, standard library only."""
from __future__ import annotations
import argparse
import json
import math
import os
from pathlib import Path
import ssl
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


class KVMError(RuntimeError):
    pass


def normalized_pixel(x: float, y: float, width: int, height: int) -> tuple[float, float]:
    if width < 2 or height < 2:
        raise ValueError('截图宽高必须至少为 2。')
    if not (math.isfinite(x) and math.isfinite(y) and 0 <= x <= width - 1 and 0 <= y <= height - 1):
        raise ValueError('像素坐标必须位于截图范围内，从 0 开始。')
    return x / (width - 1), y / (height - 1)


def validate_position(x: float, y: float) -> None:
    if not (math.isfinite(x) and math.isfinite(y) and 0 <= x <= 1 and 0 <= y <= 1):
        raise ValueError('归一化坐标必须是 0～1 的有限数值。')


class BliKVMClient:
    def __init__(self, base_url='https://192.168.8.173', token=None, *, insecure=False, ca_file=None, timeout=15):
        parts = urlsplit(base_url)
        if parts.scheme not in ('https', 'http') or not parts.netloc or parts.username or parts.password or parts.query or parts.fragment or parts.path not in ('', '/'):
            raise ValueError('设备地址应为 https://设备IP[:端口]，不包含路径或密码。')
        if timeout <= 0:
            raise ValueError('超时时间必须大于 0。')
        if insecure and ca_file:
            raise ValueError('--insecure 与 --ca-file 不可同时使用。')
        self.base_url = base_url.rstrip('/')
        self.token = token or os.environ.get('BLIKVM_TOKEN', '')
        self.timeout = timeout
        self.context = ssl._create_unverified_context() if insecure else ssl.create_default_context(cafile=ca_file)

    def _request(self, path, data=None, *, image=False):
        headers = {'Accept': 'image/jpeg' if image else 'application/json'}
        if self.token:
            headers['Authorization'] = 'Bearer ' + self.token
        payload = None
        if data is not None:
            headers['Content-Type'] = 'application/json'
            payload = json.dumps(data, allow_nan=False).encode()
        req = Request(self.base_url + path, data=payload, headers=headers, method='POST' if data is not None else 'GET')
        # Never retry input requests automatically: a timed-out click may already have executed.
        try:
            with urlopen(req, timeout=self.timeout, context=self.context) as response:
                content_type = response.headers.get_content_type()
                limit = 32 * 1024 * 1024 if image else 1024 * 1024
                body = response.read(limit + 1)
                if len(body) > limit:
                    raise KVMError('响应超过大小限制。')
        except HTTPError as exc:
            raw = exc.read(8192)
            try:
                error = json.loads(raw).get('error', '请求失败')
            except (ValueError, AttributeError):
                error = '请求失败'
            hints = {401: '检查 API Token 或设备鉴权设置。', 403: '检查账号的键鼠/画面权限。', 409: '检查 HID 开关和鼠标模式。', 503: '检查采集信号或 USB Gadget 状态。'}
            raise KVMError(f'HTTP {exc.code}: {error} {hints.get(exc.code, "")}') from None
        except (URLError, TimeoutError, OSError) as exc:
            raise KVMError(f'网络/TLS 请求失败：{exc}；检查地址、连接和证书。输入请求未自动重试。') from None
        if image:
            if content_type != 'image/jpeg' or not body.startswith(b'\xff\xd8') or not body.endswith(b'\xff\xd9'):
                raise KVMError('截图接口未返回完整 JPEG；请检查视频输入和权限。')
            return body
        try:
            result = json.loads(body)
        except ValueError:
            raise KVMError('接口未返回有效 JSON。') from None
        if not isinstance(result, dict) or result.get('ok') is not True:
            raise KVMError('接口返回失败。')
        return result

    def info(self):
        return {'auth': self._request('/api/v1/auth/state'), 'mouse': self._request('/api/v1/hid/mode')}

    def screenshot(self, filename='screenshot.jpg'):
        image = self._request('/api/v1/video/snapshot', image=True)
        target = Path(filename)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(image)
        return target

    def event(self, data):
        return self._request('/api/v1/hid/events', data)

    def press(self, key):
        return self.event({'type': 'keyboard', 'key': key})

    def shortcut(self, *keys):
        if not keys:
            raise ValueError('至少提供一个按键。')
        return self._request('/api/v1/hid/shortcuts', {'shortcuts': list(keys)})

    def _check_mode(self, relative=False):
        mode = self._request('/api/v1/hid/mode')['data']['mouseMode']
        allowed = ('relative', 'dual') if relative else ('absolute', 'dual')
        if mode not in allowed:
            raise KVMError(f'当前鼠标模式为 {mode}，此操作需要 {"relative/dual" if relative else "absolute/dual"}；程序不会自动修改 USB 配置。')

    def move(self, x, y):
        validate_position(x, y)
        self._check_mode()
        return self.event({'type': 'mouseMove', 'toX': x, 'toY': y})

    def click(self, x=None, y=None, button='left'):
        if button not in ('left', 'right', 'middle'):
            raise ValueError('button 必须为 left、right 或 middle。')
        data = {'type': 'mouseButton', 'button': button}
        if x is not None or y is not None:
            if x is None or y is None:
                raise ValueError('x、y 必须同时提供。')
            validate_position(x, y)
            self._check_mode()
            data.update(toX=x, toY=y)
        return self.event(data)

    def click_pixel(self, x, y, width, height, button='left'):
        return self.click(*normalized_pixel(x, y, width, height), button=button)

    def relative(self, dx, dy):
        if not all(math.isfinite(v) and -127 <= v <= 127 for v in (dx, dy)):
            raise ValueError('单次相对位移请使用 -127～127 的有限数值。')
        self._check_mode(relative=True)
        return self.event({'type': 'mouseRelative', 'deltaX': dx, 'deltaY': dy})

    def wheel(self, dx=0, dy=1):
        if not all(math.isfinite(v) and -127 <= v <= 127 for v in (dx, dy)):
            raise ValueError('滚轮增量应位于 -127～127。')
        return self.event({'type': 'mouseWheel', 'deltaX': dx, 'deltaY': dy})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='https://192.168.8.173')
    tls = parser.add_mutually_exclusive_group()
    tls.add_argument('--insecure', action='store_true', help='仅测试：跳过设备证书校验')
    tls.add_argument('--ca-file', help='受信任设备证书/CA 的 PEM 文件')
    parser.add_argument('--timeout', type=float, default=15)
    subs = parser.add_subparsers(dest='command', required=True)
    subs.add_parser('info', help='只读：查询鉴权和鼠标模式')
    snap = subs.add_parser('snapshot', help='只读：保存 JPEG 截图')
    snap.add_argument('output', nargs='?', default='screenshot.jpg')
    for name in ('move', 'click'):
        cmd = subs.add_parser(name)
        cmd.add_argument('x', type=float)
        cmd.add_argument('y', type=float)
        if name == 'click':
            cmd.add_argument('--button', choices=('left', 'right', 'middle'), default='left')
    pixel = subs.add_parser('click-pixel')
    for name in ('x', 'y'):
        pixel.add_argument(name, type=float)
    pixel.add_argument('--width', type=int, required=True)
    pixel.add_argument('--height', type=int, required=True)
    pixel.add_argument('--button', choices=('left', 'right', 'middle'), default='left')
    for name in ('relative', 'wheel'):
        cmd = subs.add_parser(name)
        cmd.add_argument('dx', type=float)
        cmd.add_argument('dy', type=float)
    key = subs.add_parser('key')
    key.add_argument('code', help='如 Enter、KeyA、F2')
    shortcut = subs.add_parser('shortcut')
    shortcut.add_argument('codes', nargs='+', help='如 ControlLeft KeyA')
    demo = subs.add_parser('demo', help='先截图，再点击指定位置并按键，最后截图；会操作目标电脑')
    demo.add_argument('--x', type=float, required=True)
    demo.add_argument('--y', type=float, required=True)
    demo.add_argument('--key', default='Enter')
    demo.add_argument('--wait', type=float, default=1)
    demo.add_argument('--output-dir', default='captures')
    args = parser.parse_args()
    try:
        client = BliKVMClient(args.url, insecure=args.insecure, ca_file=args.ca_file, timeout=args.timeout)
        if args.command == 'info':
            print(json.dumps(client.info(), ensure_ascii=False, indent=2))
        elif args.command == 'snapshot':
            print('已保存：', client.screenshot(args.output).resolve())
        elif args.command == 'move':
            print(client.move(args.x, args.y))
        elif args.command == 'click':
            print(client.click(args.x, args.y, args.button))
        elif args.command == 'click-pixel':
            print(client.click_pixel(args.x, args.y, args.width, args.height, args.button))
        elif args.command == 'relative':
            print(client.relative(args.dx, args.dy))
        elif args.command == 'wheel':
            print(client.wheel(args.dx, args.dy))
        elif args.command == 'key':
            print(client.press(args.code))
        elif args.command == 'shortcut':
            print(client.shortcut(*args.codes))
        elif args.command == 'demo':
            validate_position(args.x, args.y)
            if not math.isfinite(args.wait) or args.wait < 0:
                raise ValueError('--wait 必须为非负有限数值。')
            folder = Path(args.output_dir)
            print('已保存：', client.screenshot(folder / 'before.jpg').resolve())
            client.click(args.x, args.y)
            time.sleep(args.wait)
            client.press(args.key)
            time.sleep(args.wait)
            print('已保存：', client.screenshot(folder / 'after.jpg').resolve())
        return 0
    except (KVMError, ValueError, OSError) as exc:
        print(f'错误：{exc}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())

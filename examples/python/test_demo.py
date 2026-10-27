import json
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from blikvm_demo import BliKVMClient, KVMError, normalized_pixel


class DemoTests(unittest.TestCase):
    def test_pixel_edges(self):
        self.assertEqual(normalized_pixel(0, 0, 1920, 1080), (0, 0))
        self.assertEqual(normalized_pixel(1919, 1079, 1920, 1080), (1, 1))
        for args in ((1920, 0, 1920, 1080), (-1, 0, 1920, 1080), (0, 0, 1, 1080), (float('nan'), 0, 1920, 1080)):
            with self.assertRaises(ValueError):
                normalized_pixel(*args)

    def test_http_contract_and_no_retries(self):
        calls = []
        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass
            def do_GET(self):
                calls.append(('GET', self.path, None, self.headers.get('Authorization')))
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":true,"data":{"mouseMode":"absolute"}}')
            def do_POST(self):
                body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                calls.append(('POST', self.path, body, self.headers.get('Authorization')))
                self.send_response(400 if body.get('key') == 'INVALID' else 200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"ok":false,"error":"invalid key"}' if body.get('key') == 'INVALID' else b'{"ok":true}')
        server = HTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            client = BliKVMClient(f'http://127.0.0.1:{server.server_port}', token='example-test-token')
            client.click_pixel(1919, 1079, 1920, 1080)
            self.assertEqual(calls[-1][2], {'type': 'mouseButton', 'button': 'left', 'toX': 1, 'toY': 1})
            self.assertEqual(calls[-1][3], 'Bearer example-test-token')
            client.shortcut('ControlLeft', 'KeyA')
            self.assertEqual(calls[-1][1:3], ('/api/v1/hid/shortcuts', {'shortcuts': ['ControlLeft', 'KeyA']}))
            before = len(calls)
            with self.assertRaises(KVMError):
                client.relative(1, 1)
            self.assertEqual(len(calls), before + 1)
            before = len(calls)
            with self.assertRaises(KVMError):
                client.press('INVALID')
            self.assertEqual(len(calls), before + 1)
        finally:
            server.shutdown()
            thread.join()
            server.server_close()


if __name__ == '__main__':
    unittest.main()

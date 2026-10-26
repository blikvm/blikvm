// Chinese product manuals are reviewed independently.
export default {
  "tutorialSidebar": [
    "index"
  ],
  "blikvmSidebar": [
    {
      "type": "link",
      "label": "← 全部产品手册",
      "href": "/zh-CN/docs/"
    },
    "manuals/blikvm/index",
    {
      "type": "category",
      "label": "设备指南",
      "items": [
        "device-guides/BliKVM-v4-guide",
        "device-guides/BliKVM-v3-guide",
        "device-guides/BliKVM-v2-guide",
        "device-guides/BliKVM-v1-guide"
      ],
      "collapsed": false
    },
    {
      "type": "category",
      "label": "快速开始",
      "items": [
        "getting-started/first-steps",
        "getting-started/web-interface",
        "getting-started/auth",
        "getting-started/faq"
      ]
    },
    {
      "type": "category",
      "label": "视频与音频",
      "items": [
        "video/video-modes",
        "video/webrtc",
        "video/edid",
        "video/hdmi-passthrough",
        "peripheral-devices/two-way-audio",
        "video/cameras",
        "video/latency"
      ]
    },
    {
      "type": "category",
      "label": "键鼠与 USB",
      "items": [
        "peripheral-devices/keyboard-mouse/mouse",
        "peripheral-devices/keyboard-mouse/shortcuts",
        "peripheral-devices/paste-ocr",
        "peripheral-devices/keyboard-mouse/mouse-jiggler",
        "peripheral-devices/keyboard-mouse/hid-passthrough",
        "peripheral-devices/usb",
        "peripheral-devices/msd",
        "peripheral-devices/kvm-switch"
      ]
    },
    {
      "type": "category",
      "label": "网络与远程访问",
      "items": [
        "network/notes",
        "network/static-ip",
        "network/wifi",
        "network/https",
        "network/security",
        {
          "type": "category",
          "label": "远程接入方案",
          "items": [
            "network/internet-access/overview",
            "network/internet-access/wireguard",
            "network/internet-access/tailscale",
            "network/internet-access/zerotier",
            "network/internet-access/port-forwarding",
            "network/internet-access/reverse-proxy",
            "network/internet-access/cloudflare-tunnels",
            "network/internet-access/cloud",
            "function/ddns-go"
          ]
        },
        "function/wake-on-lan"
      ]
    },
    {
      "type": "category",
      "label": "设备与维护",
      "items": [
        "function/update",
        "function/fan",
        "function/OLED-display",
        "function/rtc",
        "function/interface-preferences",
        "function/atx",
        "function/serial-terminal",
        "function/ssh",
        "function/scripts",
        "function/expand-filesystem",
        "function/diagnostics",
        "function/factory-reset",
        "getting-started/flashing-os"
      ]
    },
    {
      "type": "category",
      "label": "装配与接线",
      "items": [
        "installation-instructions/BliKVM-v2-installation",
        "installation-instructions/BliKVM-v3-installation"
      ]
    },
    {
      "type": "category",
      "label": "目录与接口",
      "items": [
        "development/architecture",
        "development/api"
      ]
    }
  ],
  "bliswitchSidebar": [
    {
      "type": "link",
      "label": "← 全部产品手册",
      "href": "/zh-CN/docs/"
    },
    "manuals/bliswitch/index",
    "device-guides/BliSwitch-v1-guide",
    "device-guides/BliSwitch-v2-guide",
    {
      "type": "link",
      "label": "接入 BliKVM",
      "href": "/zh-CN/docs/peripheral-devices/kvm-switch"
    }
  ],
  "captureSidebar": [
    {
      "type": "link",
      "label": "← 全部产品手册",
      "href": "/zh-CN/docs/"
    },
    "manuals/capture/index",
    "device-guides/C792",
    "device-guides/C790",
    "device-guides/C779",
    "capture/linux-integration",
    "accessories/hdmi-csi-i2s"
  ],
  "atxSidebar": [
    {
      "type": "link",
      "label": "← 全部产品手册",
      "href": "/zh-CN/docs/"
    },
    "manuals/atx/index",
    "accessories/atx-guide",
    {
      "type": "link",
      "label": "接入 BliKVM",
      "href": "/zh-CN/docs/function/atx"
    }
  ],
  "splitterSidebar": [
    {
      "type": "link",
      "label": "← 全部产品手册",
      "href": "/zh-CN/docs/"
    },
    "manuals/splitter/index",
    "accessories/usb-splitter-guide"
  ]
};

// Product-specific manuals; keep the hierarchy aligned with sidebars.zh-CN.js.
export default {
  "tutorialSidebar": [
    "index"
  ],
  "blikvmSidebar": [
    {
      "type": "link",
      "label": "← All product manuals",
      "href": "/docs/"
    },
    "manuals/blikvm/index",
    {
      "type": "category",
      "label": "Device guides",
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
      "label": "Getting started",
      "items": [
        "getting-started/first-steps",
        "getting-started/web-interface",
        "getting-started/auth",
        "getting-started/faq"
      ]
    },
    {
      "type": "category",
      "label": "Video and audio",
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
      "label": "Keyboard, mouse and USB",
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
      "label": "Network and remote access",
      "items": [
        "network/notes",
        "network/static-ip",
        "network/wifi",
        "network/https",
        "network/security",
        {
          "type": "category",
          "label": "Remote access options",
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
      "label": "Device and maintenance",
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
      "label": "Assembly and wiring",
      "items": [
        "installation-instructions/BliKVM-v2-installation",
        "installation-instructions/BliKVM-v3-installation"
      ]
    },
    {
      "type": "category",
      "label": "Developer",
      "items": [
        "development/architecture",
        "development/api",
        "development/keyboard-api"
      ]
    }
  ],
  "bliswitchSidebar": [
    {
      "type": "link",
      "label": "← All product manuals",
      "href": "/docs/"
    },
    "manuals/bliswitch/index",
    "device-guides/BliSwitch-v1-guide",
    "device-guides/BliSwitch-v2-guide",
    {
      "type": "link",
      "label": "Connect to BliKVM",
      "href": "/docs/peripheral-devices/kvm-switch"
    }
  ],
  "captureSidebar": [
    {
      "type": "link",
      "label": "← All product manuals",
      "href": "/docs/"
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
      "label": "← All product manuals",
      "href": "/docs/"
    },
    "manuals/atx/index",
    "accessories/atx-guide",
    {
      "type": "link",
      "label": "Connect to BliKVM",
      "href": "/docs/function/atx"
    }
  ],
  "splitterSidebar": [
    {
      "type": "link",
      "label": "← All product manuals",
      "href": "/docs/"
    },
    "manuals/splitter/index",
    "accessories/usb-splitter-guide"
  ]
};

# HDMI passthrough

Passthrough sends the HDMI input onward to a local monitor. Network video comes from capture and encoding, a separate output.

## Use

1. Follow the model's diagram: computer to HDMI input, local monitor to HDMI output.
2. Verify an input mode shared by the computer, local monitor and web capture.
3. If offered, use **Settings → Video & Cameras → HDMI Video → HDMI Passthrough** and test local and web pictures separately.

A physical output does not guarantee a software switch. Current H616 and Raspberry Pi capture integrations do not advertise that control; do not manipulate GPIO to compensate for a missing menu.

For local video but a black web picture, inspect capture and transport. For working web video but a dark local monitor, inspect passthrough cabling, monitor source and mode compatibility. Maximum HDMI input capability is not network-encoding resolution; see [Video modes](./video-modes.md).

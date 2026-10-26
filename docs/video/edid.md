# HDMI EDID

EDID tells the computer which input modes a display supports. It is separate from encoding bitrate or browser scaling. Open **Settings → Video & Cameras → HDMI Video → Display EDID** on devices with write support.

## Change EDID

1. Record or save the current EDID and retain a way to manage computer display settings.
2. Choose a preset or valid custom hexadecimal content / file and apply.
3. Wait for display re-detection; rescan or reconnect HDMI on the computer if needed.
4. Check HDMI input format and confirm resolution and refresh rate are supported by the capture hardware.

Custom data needs correct length, header and checksum. Resolution text alone is not EDID. A resolution in a preset does not establish hardware capture support.

## Missing support or black screen

The current v4 / H616 capture integration does not support software EDID writing. Do not apply CSI-board settings. Raspberry Pi and other platforms also follow reported capabilities. If the menu is absent, do not edit an old `edid.txt` path.

Restore known-good EDID and reduce computer output to a supported mode if signal is lost. EDID cannot fix cabling, power or missing capture drivers. See [Video modes](./video-modes.md) for web transport.

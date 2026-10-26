# Mouse modes and touch input

Open **Settings → Keyboard, Mouse & USB**. Mouse operation depends on USB classes, device mouse mode and browser preferences, not video encoding.

## Choose a mode

- **Absolute:** positions directly in the picture, suitable for desktops supporting absolute pointers.
- **Relative:** sends displacement, useful for some BIOS interfaces, older systems and pointer-capturing programs. Computer mouse acceleration affects sensitivity.
- **Dual:** when both classes are present, switch browser behavior without rebuilding USB each time.

Check the device mode first. In dual mode select absolute / relative behavior, then adjust relative sensitivity, wheel sensitivity or direction as needed. For class changes see [USB functions](../usb.md).

## Verify and troubleshoot

1. Check USB data and input permission.
2. Test movement, clicks, drag and wheel in the desktop and BIOS separately.
3. For mismatched pointers, compare absolute and relative modes before changing multiple acceleration or video settings.
4. If defaults still fail, record OS, mode and USB function combination.

For phones and tablets select automatic, mouse or touch under **Settings → Interface Preferences → Input Method**. This browser-local preference does not change USB hardware mode. See [Interface preferences](../../function/interface-preferences.md).

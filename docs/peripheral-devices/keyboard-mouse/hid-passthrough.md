# Local USB keyboard / mouse passthrough

Open **Settings → Keyboard, Mouse & USB → USB Passthrough**. This forwards physical keyboard and mouse input from BliKVM's USB host port to the controlled computer.

It differs from browser input, USB networking and arbitrary USB redirection. It does not imply support for printers, dongles or other USB classes.

## Enable and verify

1. Attach the physical keyboard / mouse to the USB host port, retaining the device-port data cable to the computer.
2. Open passthrough and check local device detection.
3. For mouse passthrough, enable relative mouse in custom USB functions and select a mode including relative input.
4. Enable passthrough, confirm running / grabbed status and test physical input.
5. Set wheel reversal if needed and disable passthrough afterward.

“Enabled, waiting for devices” means no usable input source has been found, not successful forwarding. The system may grab local input devices. Configuration requires appropriate management permission and operation follows account permissions. No old `pass_through` file editing is needed.

# Controlled-device serial terminal

The serial terminal accesses the device physically connected to a serial port, not BliKVM's shell. It requires serial permission and correct voltage levels, wiring and port.

## Configure

1. Check the target's electrical standard, such as TTL or RS-232, and use a matching adapter. Do not directly connect incompatible levels.
2. Connect TX, RX, GND and other required signals using the hardware guide.
3. As administrator, open **Settings → Advanced & Diagnostics → Serial Settings**, choose the actual port and matching baud rate.
4. Ensure the option identifying the port as a target-device connection rather than the KVM system console matches the wiring.
5. Open **Serial Terminal**, observe boot logs and validate harmless input.

If no port appears, check the adapter, driver and permissions. Garbled output usually indicates baud-rate or electrical mismatch. For no output, check wiring, target power and port ownership.

The v4 power port also serves its own system serial console; see the model guide. That function is separate from the target-device terminal described here.

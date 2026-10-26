# USB functions and virtual networking

Open **Settings → Keyboard, Mouse & USB**. BliKVM's USB device port emulates keyboard, mouse, storage, audio, camera or network devices for the computer. Its USB host port accepts physical peripherals; the directions differ.

## Select functions

1. Record the current combination and retain a web management route.
2. Choose default, keyboard-only or custom. Open **Custom USB Functions** for a custom combination.
3. Enable only needed classes and inspect the **USB endpoint capacity**.
4. Apply, wait for re-enumeration and verify in the computer's device manager and console.

Platforms have different IN / OUT endpoint budgets. Over-budget combinations cannot be selected. Do not copy another model's combination or accidentally disable input when enabling a camera. Changes may briefly interrupt input, storage or audio.

## USB identifiers

The identifiers page sets the VID, PID, manufacturer, product and serial seen by the computer. It does not change chips or add driver capabilities. Start compatibility troubleshooting with defaults and minimal functions rather than borrowing another product's identifiers.

## USB virtual networking

Enable USB networking in custom functions and open its configuration. Set the device address, DHCP and optional network sharing. With DHCP disabled, configure the computer manually on the same subnet; sharing also needs suitable gateway and DNS settings.

Sharing lets the controlled computer use BliKVM's uplink. Enable it only with the network boundary understood. The uplink follows the preferred network. Renew the computer's DHCP lease as directed and verify local maintenance access and outbound traffic separately.

See [Virtual media](./msd.md), [Local input passthrough](./keyboard-mouse/hid-passthrough.md), [Cameras](../video/cameras.md) and [Audio](./two-way-audio.md).

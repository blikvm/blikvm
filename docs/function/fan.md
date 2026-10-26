# Temperature and fan

Device information shows health status. Devices supporting adjustable fans offer **Settings → Device & System → Fan**.

## Configure and verify

1. Check fan electrical specifications, wiring and heatsink installation. A menu does not prove a fan is installed.
2. Review and adjust temperature thresholds, then confirm saving.
3. Observe temperature and physical fan behavior under normal load. Check power and wiring if it stops unexpectedly.
4. Record ambient temperature, load and cooling conditions when comparing results.

The current v4 / H616 integration does not expose software fan control. A board connector alone does not imply web speed control. Threshold control is also different from an arbitrary PWM curve.

Display units belong to [interface preferences](./interface-preferences.md) and health display settings; they do not change hardware temperature. For persistent overheating, improve cooling and power first. Do not block cooling or run unknown stress scripts to test a fan.

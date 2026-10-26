# ATX power control for the computer

Toolbar ATX actions affect the **controlled computer**. Restarting BliKVM itself belongs to updates and maintenance.

## Wire and verify

1. Follow the [ATX accessory guide](../accessories/atx-guide.mdx) and motherboard manual for power, reset and indicator signals.
2. Confirm the intended computer; when using a switch, check the current channel first.
3. Normal power actions require power permission. Long-press forced actions require separate force-power permission.
4. Validate a planned normal action while observing both video and power indicators.

A short press emulates the case power button; firmware and OS policy determine the result. A long press can lose unsaved data, and reset is not a normal shutdown. Avoid repeated forced actions to troubleshoot an unresponsive computer.

If a request succeeds without a response, check wire order, polarity, target wiring and switch channel. Availability follows device capabilities; web users do not need to configure GPIO manually.

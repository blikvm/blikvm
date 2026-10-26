# Device time and RTC

Correct time matters for HTTPS, 2FA, VPN, update verification and audit. RTC retains time without power; network synchronization corrects drift while online. They serve different purposes.

## Check time

1. Compare device time information with a trusted source.
2. For 2FA, certificate or connectivity errors, check both device and management-computer clocks.
3. Administrators can inspect the device with read-only terminal commands:

```sh
date
ls -l /dev/rtc*
```

If an RTC node and `hwclock` are available, read the actual node, for example `hwclock -r -f /dev/rtc0`. Models need not use the same I²C bus, chip or RTC number.

## Battery and persistent synchronization

Install the model's specified battery with correct polarity. Power off before replacement and follow its hardware guide. A missing battery, unrecognized driver or long offline period can cause drift.

This guide does not require manually writing to I²C `new_device` or universally running `hwclock -w`. Persistent synchronization is managed by the installed image. Inspect hardware recognition and services before following its recovery instructions.

The temporary NTP service in video analysis is for a measurement environment, not the regular time-source setting; see [Latency measurement](../video/latency.md).

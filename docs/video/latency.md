# Video analysis and latency measurement

Open **Settings → Video & Cameras → HDMI Video → Analysis** for input / output state, bitrate, frame rate and supported latency statistics.

## Inspect measurements

1. Keep computer output, network and browser fixed and record a normal-playback baseline.
2. Enable latency statistics when needed and inspect recent samples and capture / encoding timestamps such as GRAB, ENC and LAT.
3. Change one condition at a time, such as quality or network path, and compare the same metrics.
4. Disable analysis functions when finished.

A statistic depends on its start and end points. Encoding time, network round trip and actual computer-action-to-screen latency differ. Do not treat one as full end-to-end latency or infer hardware performance from demo numbers.

## Time synchronization

The page can temporarily enable a LAN NTP service on BliKVM for measurement clients; prefer Ethernet. This differs from normal network time synchronization and RTC retention; see [Device time](../function/rtc.md).

Disable the temporary service after testing. Enabling NTP does not automatically reconfigure clients; configure and verify time synchronization on the test computer.

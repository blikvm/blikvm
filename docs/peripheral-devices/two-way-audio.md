# Audio and microphone

Audio directions have different prerequisites. Availability depends on hardware, mode, USB classes and permissions.

| Direction | Entry / prerequisites | Verification |
| --- | --- | --- |
| Computer → browser | Capturable audio, audio-capable WebRTC, toolbar volume and listening permission | Play a test sound on the computer and listen in the browser |
| Management microphone → computer | Toolbar microphone, browser permission and audio-send permission; USB microphone class on computer side | Select the USB input on the computer and inspect recording levels |
| External audio device / component | Matching hardware, system component and entry | Test the devices and states actually listed |

## Forward the browser microphone

1. Enable the microphone class in [USB functions](./usb.md) and wait for re-enumeration.
2. Use trusted HTTPS and allow the desired microphone in the browser.
3. Start toolbar microphone forwarding and select BliKVM's input device on the computer.
4. Make a short recording to check direction, volume and echo. Stop forwarding afterward.

Browser autoplay may require a click before sound starts. MJPEG carries no audio, and video recording does not necessarily include every audio direction. Headphones reduce feedback.

For a missing menu, check permissions, capabilities and system components. Old GStreamer audio commands do not replace the current native path.

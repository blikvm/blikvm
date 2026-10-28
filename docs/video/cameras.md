# External camera and browser camera forwarding

These camera paths run in different directions and are independent of computer HDMI video.

## View a USB camera connected to BliKVM

Open **Settings → Video & Cameras → External USB Camera**.

1. Connect a supported camera to BliKVM's USB host port.
2. Use automatic detection and refresh if needed. Manual device paths are for administrators who know the nodes.
3. Start the stream, verify the preview and stop when finished. Camera-view permission is required.

Detection does not guarantee codec support. For unknown devices or unsupported encoding, check hardware and system support rather than modifying the HDMI input node.

## Forward the management computer's camera

### Video walkthrough

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/vYLsI74ty7s?si=HCH4mmb8xX92jFP0"
  title="BliKVM UVC camera forwarding video walkthrough"
  style={{width: '100%', aspectRatio: '16 / 9', height: 'auto', border: 0, display: 'block'}}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  loading="lazy"
  allowFullScreen
></iframe>

[Watch on YouTube](https://www.youtube.com/watch?v=vYLsI74ty7s).

### Setup steps

Open **Settings → Video & Cameras → Browser Camera Forwarding**.

1. Enable UVC in [Custom USB functions](../peripheral-devices/usb.md), check endpoint capacity and wait for re-enumeration.
2. Use trusted HTTPS and an account with camera-send permission. Grant browser camera access.
3. Start the camera and enable writing to USB UVC. Administrators can select an offered UVC profile.
4. Select the USB camera in the controlled computer's camera or meeting app and verify the image.
5. Stop forwarding and close the camera afterward.

Profiles currently include 720p30, 480p30 and 480p15; use the options reported by the device. Only one browser publisher is allowed at once. Changing profiles may reconnect other composite USB functions. The native service receives browser H.264/WebRTC and converts it to USB UVC MJPEG, without an old standalone transcoding script.

Check camera content and privacy permissions on both computers. Demo settings do not prove a real camera was forwarded.

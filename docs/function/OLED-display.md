# LCD / OLED display

Open **Settings → Device & System → LCD/OLED Display**. The small display shows BliKVM status; it is not the controlled computer's HDMI monitor.

## Adjust display behavior

1. Confirm the model has the appropriate display and correct wiring.
2. Choose off, always on, startup hold or interval mode.
3. Enter the startup hold time or on / off periods as applicable. Apply and observe the real display.
4. Check again after reboot. A web option alone does not establish hardware behavior.

For a dark display, distinguish intentional blanking, backlight, power and ribbon-cable problems. If the page works but the display has no data, check the display service and model support. A stale displayed address should be compared with the router and network page.

Current settings are saved through the service API. The implementation varies by image; screen pins no longer need to be entered in the old `app.json`. Follow the model wiring diagram for physical installation.

## v4 front-panel buttons

v4 has a color LCD. Following the enclosure labels, briefly press the lower **BUTTON 1 / SW1** to toggle the backlight, or the upper **BUTTON 2 / SW2** to change pages and wake a dark display. Switching off the backlight does not shut down the device.

Images with the newer display provisioning service and matching driver also support holding **both buttons for about 3 seconds** to enter / exit Wi-Fi setup. Short actions execute on release. The combination suppresses individual button actions; releasing either button early cancels the countdown.

See the [v4 guide](/docs/device-guides/BliKVM-v4-guide#front-panel) for the button table, display illustrations and Wi-Fi procedure. These controls do not apply to every OLED model, and older display services may behave differently.

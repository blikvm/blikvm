# Virtual media

Virtual media presents an image stored on BliKVM as a USB flash drive or CD/DVD to the controlled computer for installers and rescue systems. It is not a shared browser-to-computer folder.

Open **Virtual Media** in the toolbar. The USB data connection and storage class must work. Media use requires media permission; uploads also need upload permission.

[![Demo virtual media](/assets/images/software-current/virtual-media-en-detail.png)](/assets/images/software-current/virtual-media-en.png)

*Demo screenshot: names, capacities and mount states are simulated; no real installer was run.*

## Mount an installer image

1. Obtain an image matching the computer's architecture and boot mode and check BliKVM free space.
2. Open the CD/DVD image area and upload an ISO. If URL import is available, BliKVM downloads it and must be able to reach the URL itself.
3. Wait for completion and the list entry. Upload success does not mean mounted.
4. Select **Mount** and confirm mounted status with an **Eject** action.
5. Open the computer's firmware boot menu and choose its USB / CD/DVD entry. Keys and names depend on the computer.
6. Confirm the installer or rescue environment starts. Eject afterward to avoid booting the installer again.

ISO is presented as read-only CD/DVD. Use the flash-drive flow for ordinary files. Renaming a file `.iso` does not make it bootable.

## Transfer files with the flash drive

1. Open the **Flash Drive** tab. If uninitialized, an administrator must initialize it; ordinary media-use permission does not grant service initialization or destruction.
2. While disconnected, upload ordinary files in the file area.
3. Wait for upload, then **Connect to host**. The computer should detect a USB disk for reading and writing.
4. To retrieve computer-written files, finish writes and safely eject on that computer, disconnect in the web interface, refresh the list and download.

The browser upload area is hidden while connected to prevent simultaneous filesystem writes. CD/DVD and flash-drive modes share the storage connection; switching may disconnect an existing CD/DVD image. Review the confirmation.

**Destroy service deletes the virtual disk and its data**; it is not an ordinary disconnect action. URL import, initialization and destruction need device-configuration permission and are normally administrator tasks.

## Disconnect safely

Finish writes and safely eject writable media on the computer before disconnecting on BliKVM. Do not delete, replace or disconnect an image during installation or disk writes. Delete stored files only after confirming the computer no longer uses them.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Upload / import fails | Space, upload permission, connection and device access to the URL |
| Uploaded but no disk on computer | Mount state, USB data cable and storage class |
| Media detected but not bootable | Architecture, UEFI / legacy mode, Secure Boot requirements and boot order |
| Installer returns after installation | Eject the image or adjust boot order |
| Input fails after USB changes | USB function combination and compatibility; reconfiguration can reconnect devices |

Use current USB settings. The old `/mnt/exec/release/config/app.json` storage configuration does not apply.

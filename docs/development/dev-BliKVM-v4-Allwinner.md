---
displayed_sidebar: blikvmSidebar
---

# v4 board-level hardware reference
![Main](/assets/images/v4/Datasheet-BliKVM-v4.assets/Main.png)

BliKVM is a production-ready, plug and play KVM-over-IP device that offers professional users a convenient solution **for remote server or workstation management**. It runs a Linux-based system. With BliKVM, you can easily **power on/off, restart your computer, configure UEFI/BIOS settings, and perform OS reinstallation using an emulated Mass Storage Device**. BliKVM simulates a keyboard, mouse, and monitor, all accessible through a web browser, ensuring a seamless user experience. **Its hardware-level access guarantees independence from specific remote ports, protocols, or services**, making it a highly flexible and reliable remote management solution for professionals!

:::info Reference scope
This page retains v4 block diagrams and electrical signals. Legacy global GPIO numbers are not gpiochip line offsets or web-user control commands. For everyday operation see the [v4 guide](../device-guides/BliKVM-v4-guide.mdx).
:::

## System Block Diagram

![Main](/assets/images/v4/hardware.png)

## Functional Module

### Panel

| Function   | Pin         | Description                         |
| ---------- | ----------- | ----------------------------------- |
| Button SW1 | GPIOI1(257) | Press for high level                |
| Button SW2 | GPIOI2(258) | Press for high level                |
| LED ACT    | GPIOI5(261) | Low level enable LED                |
| LED PWR    | 3V3         | PWR LED is always on after power on |

### ATX

| Function | Pin          | Description             |
| -------- | ------------ | ----------------------- |
| LED-PWR  | GPIOH10(234) | Light on for high level |
| LED-HDD  | GPIOH9(233)  | Light on for high level |
| SW-PWR   | GPIOH4(228)  | High level enable       |
| SW-RST   | GPIOI16(272) | High level enable       |

### BUZZER

| Function | Pin          | Description       |
| -------- | ------------ | ----------------- |
| Buzzer   | GPIOI15(271) | High level enable |

### FAN

| Function | Pin          | Description       |
| -------- | ------------ | ----------------- |
| Fan      | GPIOI13(269) | High level enable |

### LCD Display

1.33-inch LCD display module, driver chip ST7789, resolution 240x240.

| Function  | Pin         | Description                 |
| --------- | ----------- | --------------------------- |
| LCD_EN    | GPIOI4(260) | Backlight high level enable |
| LCD_RST   | GPIOI6(262) | Reset Low level enable      |
| LCD_DC    | GPIOI3(259) | Data/command control pin    |
| SPI1_CS   | GPIOH5      |                             |
| SPI1_CLK  | GPIOH6      |                             |
| SPI1_MOSI | GPIOH7      |                             |
| GND       | GND         |                             |
| 3V3       | 3V3         |                             |

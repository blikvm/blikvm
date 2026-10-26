# BLIKVM v2

![PCIe_main](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/PCIe_main.jpg)

## **1. Unpack and take out the devices**

:::note "Product List"
    ![PCIe_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/PCIe_all.jpg)
:::

## **2. Install the main device**

:::note "Install CM4 and 4 Hex spacers (This article takes CM4 lite as an example, using the image in the Micro SD card, CM4 eMMC user need to burn the image by yourself.)Stick a heat conductive sheet on the top of CM4 , tear off the protective film of the sheet. "
    ![Preparing_to_install_CM4](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Preparing_to_install_CM4.jpg)
    ![install_cm4_and_4_spacers](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_cm4_and_4_spacers.jpg)
    ![install_cm4_and_4_spacers_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_cm4_and_4_spacers_2.jpg)
    ![Stick_a_heat_conductive_sheet](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Stick_a_heat_conductive_sheet.jpg)
    ![Install_metal_heatsink](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_metal_heatsink.jpg)
:::

**The main device installation is complete.**

## **3. Connect USB and ATX**

:::note "The motherboard used in this article is Asus H520M-E, the interface definition of different motherboards may be different, please refer to your motherboard manual."
    ![connection_preparation](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connection_preparation.jpg)
    ![connect_USB_and_ATX](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX.jpg)
    ![connect_USB_and_ATX_motherboard](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX_motherboard-165941489982915.jpg)
    ![pin_definition_atx](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/pin_definition_atx.jpg)
    ![connect_USB_and_ATX_OK](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX_OK.jpg)
:::

## **4. Connect OLED**

:::note "The OLED you received does not have a bracket installed. Please refer to the picture for installation. In addition, OLED support is made of acrylic material, which needs to be used after removing the protective film on the surface."
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled01.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled02.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled03.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled04.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled05.png)

    The above is the installation steps, and the effect of not tearing the film is as follows. In actual use, please remove the protective film.
    
    ![connect_OLED](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_OLED.jpg)
:::

## **5. Connect the HDMI cable**

:::note "Connect the HDMI output port of the computer directly to the HDMI IN port of the product with an HDMI cable. The HDMI pass-through EDID emulator is not necessary! If your computer does not output the correct HDMI format, plug the HDMI pass-through EDID emulator into the HDMI output port of the computer. This allows you to configure a fixed HDMI output format on your computer."
    ![Connect_HDMI_cable_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_1.jpg)
    ![Connect_HDMI_cable_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_2.jpg)
    ![Connect_HDMI_cable_3](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_3.jpg)
:::

## **6. Connect the network cable**

:::note "Gigabit Ethernet port standard: IEEE 802.3af PoE input voltage:37v-57v."
    ![Connect_the_network_cable](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_the_network_cable.jpg)
:::

:::warning "When using PoE power supply, there is no need to connect the PWR-IN port."
:::

## **7. Connect PWR-IN**

![Connect_PWR-IN](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_PWR-IN.jpg)

:::warning "When not using PoE power supply, connect the PWR-IN port to a standard 5V/3A USB power supply."
:::

## **8. Test**

:::note "OLED screen showing device IP and other information."
    ![find_IP](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/find_IP.jpg)
    ![test_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/test_all.jpg)
    Access the IP address in browser. After passing the test, install the product into the computer case.
:::

## **9. Install the product into the computer case**

:::note "Disconnect power and wiring, install the product on the motherboard, and reconnect the cables after installation is complete. The color of ATX cable received in different batches may be different. Please directly refer to the pin definition for connection"
    ![blikvm_in_case](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/blikvm_in_case.jpg)
    ![OLED_display_out](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/OLED_display_out.jpg)
    ![finish_installation_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/finish_installation_1.jpg)
    ![finish_installation_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/finish_installation_2.jpg)
:::
Enjoy!

## **Appendix 1. Install a low profile PCIe  I/O bracket**

:::note
    ![remove_standard_bracket](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/remove_standard_bracket.jpg)
    ![replace_low_bracket_1_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_1_1.jpg)
    ![replace_low_bracket_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_2.jpg)
    ![replace_low_bracket_3](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_3.jpg)
    ![replace_low_bracket_4](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_4.jpg)
:::

## **Appendix 2. Install the cooling fan**

:::note "Usually the metal heatsink is sufficient, the cooling fan is not necessary."
    ![install_fan_prepare](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_prepare.jpg)
    ![install_fan_unscrew](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_unscrew.jpg)
    ![place_4_nylon_spacers](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/place_4_nylon_spacers.jpg)
    ![install_fan_ok](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_ok.jpg)
    ![fan_power_polarity](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/fan_power_polarity.jpg)
    ![install_fan_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_all.jpg)
:::

:::info "The cooling fan is controlled by CM4 via GPIO12."
:::

## **Appendix 3. Install wifi antenna**

:::note
    ![Install_wifi_antenna_prepare](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_wifi_antenna_prepare.jpg)
    ![Install_wifi_antenna](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_wifi_antenna.jpg)
:::
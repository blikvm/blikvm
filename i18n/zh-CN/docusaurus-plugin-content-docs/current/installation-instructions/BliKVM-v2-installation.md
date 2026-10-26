# BliKVM v2

![PCIe_main](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/PCIe_main.jpg)

## **1. 拆包并取出设备**

:::note "产品清单"
    ![PCIe_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/PCIe_all.jpg)
:::

## **2. 安装主设备**

:::note "安装 CM4 和 4 个六角隔柱（本文以 CM4 lite 为例，使用 Micro SD 卡中的镜像，CM4 eMMC 用户需自行烧录镜像。）在 CM4 顶部贴上导热片，并撕掉导热片的保护膜。"
    ![Preparing_to_install_CM4](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Preparing_to_install_CM4.jpg)
    ![install_cm4_and_4_spacers](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_cm4_and_4_spacers.jpg)
    ![install_cm4_and_4_spacers_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_cm4_and_4_spacers_2.jpg)
    ![Stick_a_heat_conductive_sheet](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Stick_a_heat_conductive_sheet.jpg)
    ![Install_metal_heatsink](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_metal_heatsink.jpg)
:::

**主设备安装完成。**

## **3. 连接 USB 和 ATX**

:::note "本文使用的主板为华硕 H520M-E，不同主板的接口定义可能不同，请参考您的主板手册。"
    ![connection_preparation](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connection_preparation.jpg)
    ![connect_USB_and_ATX](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX.jpg)
    ![connect_USB_and_ATX_motherboard](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX_motherboard-165941489982915.jpg)
    ![pin_definition_atx](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/pin_definition_atx.jpg)
    ![connect_USB_and_ATX_OK](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_USB_and_ATX_OK.jpg)
:::

## **4. 连接 OLED**

:::note "您收到的 OLED 没有安装支架，请参考图片进行安装。此外，OLED 支架由亚克力材料制成，需撕掉表面保护膜后使用。"
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled01.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled02.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled03.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled04.png)
    ![connect_OLED](/assets/images/BLIKVM-PCIe/oled/install-oled05.png)

    以上是安装步骤，未撕膜效果如下。实际使用时，请撕掉保护膜。
    
    ![connect_OLED](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/connect_OLED.jpg)
:::

## **5. 连接 HDMI 线**

:::note "使用 HDMI 线将电脑的 HDMI 输出端口直接连接到产品的 HDMI IN 端口。HDMI 直通 EDID 模拟器不是必需的！如果您的电脑未输出正确的 HDMI 格式，请将 HDMI 直通 EDID 模拟器插入电脑的 HDMI 输出端口。这可以让您在电脑上配置固定的 HDMI 输出格式。"
    ![Connect_HDMI_cable_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_1.jpg)
    ![Connect_HDMI_cable_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_2.jpg)
    ![Connect_HDMI_cable_3](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_HDMI_cable_3.jpg)
:::

## **6. 连接网线**

:::note "千兆以太网端口标准：IEEE 802.3af PoE 输入电压：37v-57v。"
    ![Connect_the_network_cable](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_the_network_cable.jpg)
:::

:::warning "使用 PoE 供电时，无需连接 PWR-IN 端口。"
:::

## **7. 连接 PWR-IN**

![Connect_PWR-IN](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Connect_PWR-IN.jpg)

:::warning "未使用 PoE 供电时，将 PWR-IN 端口连接到标准 5V/3A USB 电源。"
:::

## **8. 测试**

:::note "OLED 屏幕显示设备 IP 和其他信息。"
    ![find_IP](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/find_IP.jpg)
    ![test_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/test_all.jpg)
    在浏览器中访问 IP 地址。测试通过后，将产品安装到电脑机箱中。
:::

## **9. 将产品安装到电脑机箱中**

:::note "断开电源和布线，将产品安装到主板上，安装完成后重新连接电缆。不同批次收到的 ATX 电缆颜色可能不同，请直接参考针脚定义进行连接。"
    ![blikvm_in_case](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/blikvm_in_case.jpg)
    ![OLED_display_out](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/OLED_display_out.jpg)
    ![finish_installation_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/finish_installation_1.jpg)
    ![finish_installation_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/finish_installation_2.jpg)
:::
享受使用吧！

## **附录 1. 安装低调 PCIe I/O 支架**

:::note
    ![remove_standard_bracket](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/remove_standard_bracket.jpg)
    ![replace_low_bracket_1_1](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_1_1.jpg)
    ![replace_low_bracket_2](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_2.jpg)
    ![replace_low_bracket_3](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_3.jpg)
    ![replace_low_bracket_4](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/replace_low_bracket_4.jpg)
:::

## **附录 2. 安装散热风扇**

:::note "通常金属散热片已足够，散热风扇不是必需的。"
    ![install_fan_prepare](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_prepare.jpg)
    ![install_fan_unscrew](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_unscrew.jpg)
    ![place_4_nylon_spacers](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/place_4_nylon_spacers.jpg)
    ![install_fan_ok](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_ok.jpg)
    ![fan_power_polarity](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/fan_power_polarity.jpg)
    ![install_fan_all](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/install_fan_all.jpg)
:::

:::info "散热风扇由 CM4 通过 GPIO12 控制。"
:::

## **附录 3. 安装 WiFi 天线**

:::note
    ![Install_wifi_antenna_prepare](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_wifi_antenna_prepare.jpg)
    ![Install_wifi_antenna](/assets/images/BLIKVM-PCIe/BLIKVM_PCIe_Installation_Guide.assets/Install_wifi_antenna.jpg)
:::
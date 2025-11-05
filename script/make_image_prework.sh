#!/bin/bash

set -x

# touch firstboot file
touch /mnt/tmp/firstboot

# make sure i2c-8 is enabled in config.txt for v5 hardware
#CFG="/boot/firmware/config.txt"
#dtoverlay=i2c-gpio,bus=8,i2c_gpio_sda=22,i2c_gpio_scl=23

# clean history command
history -c && history -w


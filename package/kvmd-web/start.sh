#!/bin/bash
set -x

# check /mnt/tmp/firstboot 
check_firstboot() {
  if [ -f "/mnt/tmp/firstboot" ]; then
    echo "Found /mnt/tmp/firstboot file. Resizing mmcblk0p3 partition..."
    resize_mmcblk0p3

    mount -o remount,rw /
    
    rm -rf /etc/machine-id
    rm -rf /var/lib/dbus/machine-id

    dbus-uuidgen --ensure=/etc/machine-id
    dbus-uuidgen --ensure
    
    rm -f /home/blikvm/.bash_history
    rm -f /root/.bash_history

    # if the hardware is v5, need to comment the i2c-8 on config.txt
    DETECT_OUT="$(i2cdetect -y 8 0x50 0x50 2>/dev/null || true)"
    if ! echo "$DETECT_OUT" | awk 'NR>1{ for(i=2;i<=NF;i++) if($i=="50"||$i=="UU"){found=1} } END{ exit found?0:1 }'; then
      echo "I2C device 0x50 not detected on bus 8, commenting out overlay in /boot/firmware/config.txt ..."
      CFG="/boot/firmware/config.txt"
      if [ -f "$CFG" ]; then
        mount -o remount,rw /boot/firmware
        sed -i 's|^dtoverlay=i2c-gpio,bus=8,i2c_gpio_sda=22,i2c_gpio_scl=23|# dtoverlay=i2c-gpio,bus=8,i2c_gpio_sda=22,i2c_gpio_scl=23|' "$CFG"
      else
        echo "Config file not found: $CFG"
      fi
      sync
      mount -o remount,ro /
      mount -o remount,ro /boot/firmware
      rm -f "/mnt/tmp/firstboot"
      echo "Rebooting to apply changes..."
      reboot
      exit 0
    fi
    mount -o remount,ro /
    # delete /mnt/tmp/firstboot 
    rm -f "/mnt/tmp/firstboot"
  else
    echo "No /mnt/tmp/firstboot file found. Skipping partition resizing."
  fi
}

# expand mmcblk0p3 

resize_mmcblk0p3() {
  echo "Resizing mmcblk0p3 partition..."
  umount /dev/mmcblk0p3
  parted -s /dev/mmcblk0 resizepart 3 100%
  e2fsck -fy /dev/mmcblk0p3
  resize2fs /dev/mmcblk0p3
  mount /dev/mmcblk0p3
  echo "mmcblk0p3 partition resized successfully."
}


echo "Starting partition resizing..."

check_firstboot

echo "Partition resizing completed."
cd /mnt/exec/release
/mnt/exec/release/server_app

wait $!

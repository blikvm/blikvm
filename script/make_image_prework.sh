#!/bin/bash

set -x

# touch firstboot file
touch /mnt/tmp/firstboot

# clean history command
history -c && history -w


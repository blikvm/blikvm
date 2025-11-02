#!/bin/bash
set -euo pipefail
set -x

HW_ARG="${1:-}"   # 可选：pi / allwinner

case "$HW_ARG" in
  pi|allwinner)
    echo "使用硬件类型: $HW_ARG"
    export HARDWARE_TYPE="$HW_ARG"
    ;;
  "" )
    echo "未指定硬件类型，使用默认"
    ;;
  * )
    echo "未知硬件类型: $HW_ARG (只支持: pi | allwinner)"; exit 1
    ;;
esac

# build client
cd web_client
npm install
npm run build
cp -r dist ../web_server
cd ..

# build server
cd web_server
npm install
# 若已 export HARDWARE_TYPE，则 npm run build-3 中的 cross-env 会拿到
npm run build
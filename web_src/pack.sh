#!/bin/bash
set -euo pipefail
set -x

HW_ARG="${1:-}"   # 可选：pi / allwinner

case "$HW_ARG" in
  pi|allwinner)
    echo "Hardware is: $HW_ARG"
    export HARDWARE_TYPE="$HW_ARG"
    ;;
  "" )
    echo "Hardware is: default"
    ;;
  * )
    echo "Unknown hardware type: $HW_ARG (only supports: pi | allwinner)"; exit 1
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
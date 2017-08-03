#!/bin/bash
if [ -d "types-grafana" ]; then
  rm -rf types-grafana
fi

git clone https://github.com/corpglory/types-grafana
cp -rf types-grafana/app node_modules/@types/
rm -rf types-grafana
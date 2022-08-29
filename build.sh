#!/bin/bash
echo "Removing dist"
rm -fr dist
echo "building"
yarn build
echo "removing source maps"
rm -fr dist/*.map
echo "packing"
zip -vr game.zip dist -x "*.DS_Store"
echo "size"
du -sh game.zip

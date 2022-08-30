#!/bin/bash
echo "Removing dist"
rm -fr dist
echo "renaming classes"
yarn rename
echo "building"
yarn build
echo "removing source maps"
rm -fr dist/*.map
echo "uglify"
yarn uglify
echo "removing non-ugly js"
rm dist/index.*.js
echo "remove old zip"
rm game.zip
echo "packing"
zip -vr game.zip dist -x "*.DS_Store"
echo "size"
du -sh game.zip

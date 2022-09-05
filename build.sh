#!/bin/bash
echo "Removing dist and .parcel-cache"
rm -fr dist .parcel-cache
echo "renaming classes"
yarn rename
echo "building"
yarn build
echo "removing source maps"
rm -fr dist/*.map
echo "uglify"
yarn uglify
echo "Roadroller"
yarn run-roadroller
echo "removing non-road-roller js"
rm dist/index.*.js dist/ugly.js
echo "Replacing file name"
sed -i .bak 's/index.*.js/s.js/' dist/index.html
rm -fr dist/*.bak
echo "remove old zip"
rm game.zip
echo "packing"
zip -vrj game.zip dist -x "*.DS_Store" -9
echo "Recompressing using advzip"
advzip -z game.zip

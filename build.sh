#!/bin/bash
rm -fr dist
yarn build
zip -vr game.zip dist -x "*.DS_Store"
du -sh game.zip

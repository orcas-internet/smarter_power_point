#!/usr/bin/env bash

cp -r app smarterPowerPoint
rm -f smarterPowerPoint-1.0.0.tar.gz
tar -czvf smarterPowerPoint-1.0.0.tar.gz smarterPowerPoint
rm -r smarterPowerPoint
mv -f smarterPowerPoint-1.0.0.tar.gz ../service/
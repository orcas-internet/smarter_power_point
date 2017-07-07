#!/usr/bin/env bash

cp app smarterPowerPoint
rm smarterPowerPoint-1.0.0.tar.gz
tar -czvf smarterPowerPoint-1.0.0.tar.gz smarterPowerPoint
rm -r smarterPowerPoint
cp -f smarterPowerPoint-1.0.0.tar.gz ../service/
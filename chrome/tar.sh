#!/usr/bin/env bash

version=$( cat version.txt )

echo "Packaging smarterPowerPoint version ${version}"

cp -r app smarterPowerPoint
rm -f "smarterPowerPoint.tar.gz"
tar -czf "smarterPowerPoint.tar.gz" smarterPowerPoint
rm -r smarterPowerPoint
rm -r ../service/smarterPowerPoint*.tar.gz
mv -f  "smarterPowerPoint.tar.gz" ../service/

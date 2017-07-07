#!/bin/bash

# (c) orcas 2017
# convert wav files to mp3
#
# preparations:
#   # to get sound card output to wav file
#   wget http://outflux.net/software/pa-clone
#   chmod u+x pa-clone
#   ./pa-clone output.wav
#
#   # to convert wav to mp3
#   sudo apt-get install libsox-fmt-mp3 sox

function debugOn # ( )
{
    set -x
    set -T
    trap 'read' DEBUG
}

param1="$1"
param2="$2"

function wav2mp3 # ( aFile )
{
    local aFile="$1"

    if [ -f "${aFile%.*}.mp3" ]; then
        if [ "${param2}" != "-f" ]; then
            echo "file '${aFile%.*}.mp3' exists. Use -f to overwrite or remove it before."
            return
        fi
    fi
    sox "${aFile}" "${aFile%.*}.mp3"
    echo "file '${aFile}' converted to '${aFile%.*}.mp3'"
}

if [ -d "${param1}" ]; then
    for file in $(ls ${param1}/*.wav); do
        wav2mp3 "${file}"
    done
elif [ -f "${param1}" ]; then
    wav2mp3 "${param1}"
else
    echo "convert wav to mp3"
    echo "use:"
    echo "  $(basename $0) FILE|FOLDER [-f]"
    echo ""
    echo "    -f = force overwrite"
fi
#!/bin/bash

sudo rsync -avzr \
     --exclude 'install.sh' \
     --exclude 'README.md' \
     --exclude '.git/' \
     --exclude '.*' \
     $(pwd)/ \
     /usr/share/lightdm-webkit/themes/vaporwave/

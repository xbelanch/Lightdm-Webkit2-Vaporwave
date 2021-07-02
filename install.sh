#!/bin/bash

sudo rsync -avzr \
     --exclude 'install.sh' \
     --exclude 'README.md' \
     --exclude 'NOTES.md' \
     --exclude '.git/' \
     --exclude '.*' \
     $(pwd)/ \
     /usr/share/lightdm-webkit/themes/vaporwave/

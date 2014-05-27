#!/bin/bash

if [ -e snippets ]; then
    cd snippets
    git pull
else
    git clone https://github.com/aheui/snippets
fi
cd snippets
chmod 755 ../cli.js
AHEUI=../cli.js bash test.sh

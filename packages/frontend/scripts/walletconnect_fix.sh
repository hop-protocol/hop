#!/bin/bash

# Issue: https://github.com/blocknative/web3-onboard/issues/2019
#
# This is temp fix to fix the WalletConnect modal not showing.
# The issue is the "destr" dependency in WalletConnect isn't working as expected for some reason,
# and can be simply replaced with JSON.parse as the workaround.

# Define the file path
FILE_PATH="node_modules/unstorage/dist/index.mjs"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
    # Use sed to replace 'destr' with 'JSON.parse' in the file
    sed -i 's/destr(value)/JSON.parse(value)/g' "$FILE_PATH"
    echo "Temp fix applied."
else
    echo "Error: File does not exist."
fi

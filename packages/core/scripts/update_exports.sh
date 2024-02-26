#!/bin/bash

# Function to update file with sed command based on OS
update_file() {
    local file_path=$1
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS uses BSD sed
        sed -i '' 's|export \* as factories from "./factories";|export * as factories from "./factories/index.js";|' "$file_path"
        sed -i '' 's|export \* as generated from "./generated";|export * as generated from "./generated/index.js";|' "$file_path"
        sed -i '' 's|export \* as nonGenerated from "./non_generated";|export * as nonGenerated from "./non_generated/index.js";|' "$file_path"
    else
        # Linux and other systems use GNU sed
        sed -i 's|export \* as factories from "./factories";|export * as factories from "./factories/index.js";|' "$file_path"
        sed -i 's|export \* as generated from "./generated";|export * as generated from "./generated/index.js";|' "$file_path"
        sed -i 's|export \* as nonGenerated from "./non_generated";|export * as nonGenerated from "./non_generated/index.js";|' "$file_path"
    fi
}

# Define file paths
FILE_PATH_1="./dist/esm/contracts/index.js"
FILE_PATH_2="./dist/esm/contracts/factories/index.js"

# Update FILE_PATH_1 if it exists
if [ -f "$FILE_PATH_1" ]; then
    update_file "$FILE_PATH_1"
    echo "File updated successfully: $FILE_PATH_1"
else
    echo "File does not exist: $FILE_PATH_1"
fi

# Update FILE_PATH_2 if it exists
if [ -f "$FILE_PATH_2" ]; then
    update_file "$FILE_PATH_2"
    echo "File updated successfully: $FILE_PATH_2"
else
    echo "File does not exist: $FILE_PATH_2"
fi

#!/bin/bash

# Function to install jq
install_jq() {
    if command -v jq > /dev/null 2>&1; then
        echo "jq is already installed."
        return
    fi

    # Detect package manager and install jq
    if command -v apt > /dev/null 2>&1; then
        echo "Using apt to install jq..."
        sudo apt update
        sudo apt install -y jq
    elif command -v dnf > /dev/null 2>&1; then
        echo "Using dnf to install jq..."
        sudo dnf install -y jq
    elif command -v yum > /dev/null 2>&1; then
        echo "Using yum to install jq..."
        sudo yum install -y jq
    else
        echo "Package manager not supported. Please install jq manually."
        exit 1
    fi

    echo "jq installation complete."
}

# Call the install function
install_jq
#!/bin/bash

apps=(".."/code ".."/meet ".."/main ".."/enterprise ".."/candidate ".."/campus")

for app in "${apps[@]}"; do
    echo "Building ${app##*/}..."
    pushd "$app" > /dev/null || { echo "Failed to enter directory $app"; exit 1; }
    npm run build
    if [ $? -ne 0 ]; then
        echo "Build failed for ${app##*/}"
        exit 1
    fi
    popd > /dev/null
done

echo "All apps built successfully!"

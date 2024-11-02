#!/bin/bash

# Color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Apps to build
apps=("../code" "../meet" "../main" "../enterprise" "../candidate" "../campus" "../server")

# Clear screen
clear

# Header
echo -e "${CYAN}==============================================="
echo -e "               BUILD PROCESS STARTED               "
echo -e "===============================================${NC}"
echo

# Initialize counters
total=${#apps[@]}
current=0

# Get start time
start_time=$(date +%s)

# Progress bar function
progress_bar() {
    local width=50
    local percentage=$1
    local filled=$(((percentage * width) / 100))
    local empty=$((width - filled))
    
    printf "["
    printf "#%.0s" $(seq 1 $filled)
    printf "-%.0s" $(seq 1 $empty)
    printf "] %d%%\n" "$percentage"
}

for app in "${apps[@]}"; do
    ((current++))
    percentage=$((current * 100 / total))
    
    app_name=$(basename "$app")
    echo -e "${YELLOW}[$(date +%T)] Building ${app_name}...${NC}"
    echo -ne "${CYAN}"
    progress_bar $percentage
    echo -ne "${NC}"
    
    # Change to app directory
    pushd "$app" > /dev/null
    
    # Install dependencies
    echo -e "${YELLOW}Installing dependencies...${NC}"
    if ! npm install > /dev/null 2>&1; then
        echo -e "${RED}[ERROR] npm install failed for ${app_name}${NC}"
        echo -e "${RED}==============================================="
        echo -e "               BUILD PROCESS FAILED               "
        echo -e "===============================================${NC}"
        popd > /dev/null
        exit 1
    fi
    
    # Run build
    if ! npm run build; then
        echo -e "${RED}[ERROR] Build failed for ${app_name}${NC}"
        echo -e "${RED}==============================================="
        echo -e "               BUILD PROCESS FAILED               "
        echo -e "===============================================${NC}"
        popd > /dev/null
        exit 1
    fi
    
    echo -e "${GREEN}[SUCCESS] Built ${app_name} successfully!${NC}"
    echo
    
    popd > /dev/null
done

# Calculate duration
end_time=$(date +%s)
duration=$((end_time - start_time))

# Success footer
echo -e "${GREEN}==============================================="
echo -e "               BUILD PROCESS COMPLETE               "
echo -e "==============================================="
echo
echo -e "Total apps: ${total}"
echo -e "Build duration: ${duration} seconds${NC}"
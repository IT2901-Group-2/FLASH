#!/bin/bash


# Output files
OUTPUT_FILE="../src/styles/global.css"
DATA_ATTR_FILE="../src/styles/data-colors.css"

GLOBAL_ALPHA=0.8
GLOBAL_NAMES=(
    soft
    moderate
    moderate-hover
    moderate-pressed
    strong
    strong-hover
    strong-pressed
)
LIGHT_CONFIG=(
    1.4
    1.2
    1.1
    1.05
    0.8
    0.7
    0.6
)
DARK_CONFIG=($(printf "%s\n" "${LIGHT_CONFIG[@]}" | tac))


hex_to_rgb() {
    local hex=$1
    hex=${hex#"#"}
    printf "%d, %d, %d" 0x"${hex:0:2}" 0x"${hex:2:2}" 0x"${hex:4:2}"
}
#!/bin/bash

# Tailwind Color Spectrum Generator
# Usage: ./generate-colors.sh colors.txt
# Format: color-name: #hexcode

# Output files
OUTPUT_FILE="../src/styles/global.css"
DATA_ATTR_FILE="../src/styles/data-colors.css"
TYPESCRIPT_FILE="../src/styles/colorType.ts"

# Function to convert hex to RGB
hex_to_rgb() {
    local hex=$1
    hex=${hex#"#"}
    printf "%d %d %d" 0x"${hex:0:2}" 0x"${hex:2:2}" 0x"${hex:4:2}"
}

# Function to adjust lightness
adjust_color() {
    local r=$1 g=$2 b=$3 factor=$4
    
    if (( $(echo "$factor > 1" | bc -l) )); then
        # Lighten: interpolate towards white (255)
        local scale=$(echo "($factor - 1) / 4" | bc -l)
        r=$(printf "%.0f" $(echo "$r + ($scale * (255 - $r))" | bc -l))
        g=$(printf "%.0f" $(echo "$g + ($scale * (255 - $g))" | bc -l))
        b=$(printf "%.0f" $(echo "$b + ($scale * (255 - $b))" | bc -l))
    else
        # Darken: multiply by factor
        r=$(printf "%.0f" $(echo "$r * $factor" | bc -l))
        g=$(printf "%.0f" $(echo "$g * $factor" | bc -l))
        b=$(printf "%.0f" $(echo "$b * $factor" | bc -l))
    fi
    
    # Clamp values
    r=$(( r > 255 ? 255 : r < 0 ? 0 : r ))
    g=$(( g > 255 ? 255 : g < 0 ? 0 : g ))
    b=$(( b > 255 ? 255 : b < 0 ? 0 : b ))
    
    printf "#%02x%02x%02x" $r $g $b
}

# Check if input file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <colors-file>"
    echo "Example file format:"
    echo "  brand-purple: #60344e"
    echo "  success: #3d9751"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "Error: File '$1' not found"
    exit 1
fi

# Clear output files
> "$OUTPUT_FILE"
> "$DATA_ATTR_FILE"

# Import data-color styles
echo "@import \"./data-colors.css\";" >> "$OUTPUT_FILE"
echo "@import \"./canvas.css\";" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Output light theme
echo ":root {" >> "$OUTPUT_FILE"

echo "  --color-neutral-000: #ffffff;" >> "$OUTPUT_FILE"
while IFS=: read -r name hex || [ -n "$name" ]; do
    # Skip empty lines and comments
    [[ -z "$name" || "$name" =~ ^[[:space:]]*# ]] && continue
    
    # Clean up whitespace
    name=$(echo "$name" | tr -d '[:space:]')
    hex=$(echo "$hex" | tr -d '[:space:]')
    
    # Convert base color to RGB
    read -r r g b <<< $(hex_to_rgb "$hex")
    
    # Generate spectrum (100-1000, with 500 as base)
    shades=(100 200 300 400 500 600 700 800 900 1000)
    factors=(3.5 2.5 1.7 1.2 1.0 0.85 0.7 0.55 0.4 0.25)
    
    for i in "${!shades[@]}"; do
        shade=${shades[$i]}
        factor=${factors[$i]}
        color=$(adjust_color $r $g $b $factor)
        echo "  --color-$name-$shade: $color;" >> "$OUTPUT_FILE"
    done
done < "$1"

echo "}" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Output dark theme (inverted shades)
echo "[data-theme=\"dark\"] {" >> "$OUTPUT_FILE"

echo "  --color-neutral-000: #000000;" >> "$OUTPUT_FILE"
while IFS=: read -r name hex || [ -n "$name" ]; do
    [[ -z "$name" || "$name" =~ ^[[:space:]]*# ]] && continue
    
    name=$(echo "$name" | tr -d '[:space:]')
    hex=$(echo "$hex" | tr -d '[:space:]')
    
    read -r r g b <<< $(hex_to_rgb "$hex")
    
    shades=(100 200 300 400 500 600 700 800 900 1000)
    factors=(3.5 2.5 1.7 1.2 1.0 0.85 0.7 0.55 0.4 0.25)
    
    # Reverse the mapping for dark theme
    for i in "${!shades[@]}"; do
        shade=${shades[$i]}
        reverse_idx=$((${#shades[@]} - 1 - i))
        factor=${factors[$reverse_idx]}
        color=$(adjust_color $r $g $b $factor)
        echo "  --color-$name-$shade: $color;" >> "$OUTPUT_FILE"
    done
done < "$1"

echo "}" >> "$OUTPUT_FILE"

# Generate data-color attributes
while IFS=: read -r name hex || [ -n "$name" ]; do
    [[ -z "$name" || "$name" =~ ^[[:space:]]*# ]] && continue
    
    name=$(echo "$name" | tr -d '[:space:]')
    
    echo "[data-color=\"$name\"] {" >> "$DATA_ATTR_FILE"
    
    shades=(100 200 300 400 500 600 700 800 900 1000)
    for shade in "${shades[@]}"; do
        echo "  --data-color-$shade: var(--color-$name-$shade);" >> "$DATA_ATTR_FILE"
    done
    
    echo "}" >> "$DATA_ATTR_FILE"
    echo "" >> "$DATA_ATTR_FILE"
done < "$1"

# Generate typescript file for color types
echo "// Auto-generated color types" > "$TYPESCRIPT_FILE"
echo "export const colorNames = [" >> "$TYPESCRIPT_FILE"
first=true
while IFS=: read -r name hex || [ -n "$name" ]; do
    [[ -z "$name" || "$name" =~ ^[[:space:]]*# ]] && continue
    name=$(echo "$name" | tr -d '[:space:]')
    if [ "$first" = true ]; then
        echo "  \"$name\"," >> "$TYPESCRIPT_FILE"
        first=false
    else
        echo "  \"$name\"," >> "$TYPESCRIPT_FILE"
    fi
done < "$1"
echo "] as const;" >> "$TYPESCRIPT_FILE"
echo "" >> "$TYPESCRIPT_FILE"
echo "export type ColorName = (typeof colorNames)[number];" >> "$TYPESCRIPT_FILE"

# Format output files using Prettier
# pnpm prettier --write "$OUTPUT_FILE" "$DATA_ATTR_FILE" "$TYPESCRIPT_FILE"

echo "Color spectrum generated:"
echo "  - $OUTPUT_FILE"
echo "  - $DATA_ATTR_FILE"
echo "  - $TYPESCRIPT_FILE"
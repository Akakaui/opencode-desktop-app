#!/usr/bin/env bash
set -euo pipefail

errors=0
page="landing-page/index.html"

# Check internal resource files referenced in index.html
echo "=== Checking internal resource links ==="

# Extract src/href values that are relative paths
while IFS= read -r ref; do
  [[ -z "$ref" ]] && continue
  file="landing-page/$ref"
  if [[ ! -f "$file" ]]; then
    echo "MISSING: $ref (resolved to $file)"
    errors=$((errors + 1))
  else
    echo "OK: $ref"
  fi
done < <(grep -oP '(?:src|href)="(?!https?://|#|mailto:|tel:)([^"]+)"' "$page" | sed 's/.*="//;s/"$//')

echo ""
if ((errors == 0)); then
  echo "All internal resource links are valid."
else
  echo "Found $errors broken internal link(s)."
  exit 1
fi

#!/bin/bash
# Publish v12/models to a Cloudflare R2 bucket and print the public base URL.
# Needs ~/.config/yk-r2.env with:
#   CLOUDFLARE_ACCOUNT_ID=...      (Cloudflare dashboard → R2 → Account ID)
#   CLOUDFLARE_API_TOKEN=...       (API token with "Workers R2 Storage: Edit")
#   R2_BUCKET=yk-models            (any bucket name; created if missing)
set -euo pipefail
cd "$(dirname "$0")/.."
ENV="${HOME}/.config/yk-r2.env"; [ -f "$ENV" ] || { echo "missing $ENV"; exit 1; }
set -a; source "$ENV"; set +a
: "${CLOUDFLARE_ACCOUNT_ID:?}" "${CLOUDFLARE_API_TOKEN:?}" "${R2_BUCKET:=yk-models}"
W="npx --yes wrangler@4"
$W r2 bucket create "$R2_BUCKET" 2>/dev/null || echo "bucket exists: $R2_BUCKET"
$W r2 bucket cors set "$R2_BUCKET" --file scripts/r2-cors.json
$W r2 bucket dev-url enable "$R2_BUCKET" --force | tee /tmp/r2-devurl.txt
BASE=$(grep -o 'https://pub-[a-z0-9]*\.r2\.dev' /tmp/r2-devurl.txt | head -1)
n=0
for f in v12/models/*; do
  name=$(basename "$f"); case "$name" in
    *.glb) ct="model/gltf-binary";; *.json) ct="application/json";; *.jpg) ct="image/jpeg";; *) ct="application/octet-stream";; esac
  $W r2 object put "$R2_BUCKET/$name" --file "$f" --content-type "$ct" --remote >/dev/null && n=$((n+1)) && echo "up  $name"
done
echo "uploaded $n files"
echo "BASE URL: $BASE/"
echo "Now set <html data-models-base=\"$BASE/\"> in v12/index.html (scripts/r2-publish.sh does not edit the page)."

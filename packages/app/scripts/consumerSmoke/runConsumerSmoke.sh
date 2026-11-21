#!/usr/bin/env bash
# Installs @khsura/sui the way an app does — from the packed tarball, with npm, outside the workspace —
# and checks that a minimal Vite app can use it:
#   1. without vue-router: the client app builds, its bundle never asks for vue-router, and `to` renders <a href>
#   2. with vue-router (4 and 5): `to` renders a RouterLink (a route given by name resolves to its URL)
#
# Run after `yarn build` in packages/app (it packs dist/ and @types/). Needs network access for npm.
# Usage: runConsumerSmoke.sh
set -euo pipefail

app_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fixture_dir="$app_dir/scripts/consumerSmoke/fixture"
vue_router_majors=(4 5)

if [[ ! -f "$app_dir/dist/s-ui.js" ]]; then
  echo "consumer smoke: $app_dir/dist/s-ui.js is missing; run 'yarn build' in packages/app first." >&2
  exit 1
fi

work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

echo "consumer smoke: packing @khsura/sui"
(cd "$app_dir" && yarn pack --out "$work_dir/sui.tgz" > /dev/null)

consumer_dir="$work_dir/consumer"
mkdir -p "$consumer_dir"
cp -R "$fixture_dir/." "$consumer_dir"
cd "$consumer_dir"

npm_install() {
  npm install --no-audit --no-fund --loglevel=error "$@"
}

echo "consumer smoke: installing the tarball without vue-router"
npm_install "$work_dir/sui.tgz"

if [[ -d node_modules/vue-router ]]; then
  echo "consumer smoke: vue-router was installed transitively; @khsura/sui must not pull it in." >&2
  exit 1
fi

echo "consumer smoke: building the client app without vue-router"
npx vite build --logLevel warn

# The published files must not load vue-router in any module format (the dev warning may name it).
if grep -rEq "(from|import|require\()[[:space:]]*[\"'\`]vue-router[\"'\`]|define\(\[[^]]*[\"'\`]vue-router[\"'\`]" node_modules/@khsura/sui/dist; then
  echo "consumer smoke: the published bundle imports vue-router." >&2
  exit 1
fi

echo "consumer smoke: rendering links without vue-router"
npx vite build --logLevel warn --ssr src/renderWithoutRouter.ts --outDir dist-ssr
node dist-ssr/renderWithoutRouter.js

for major in "${vue_router_majors[@]}"; do
  echo "consumer smoke: rendering links with vue-router@$major"
  npm_install "vue-router@$major"
  npx vite build --logLevel warn --ssr src/renderWithRouter.ts --outDir dist-ssr
  node dist-ssr/renderWithRouter.js
done

echo "consumer smoke: passed"

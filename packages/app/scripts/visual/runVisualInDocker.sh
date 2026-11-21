#!/usr/bin/env bash
# Runs the visual regression harness inside the official Playwright image, the same environment CI uses,
# so local screenshots are comparable with the committed baselines.
#
# Usage: runVisualInDocker.sh [--update] [extra Playwright args, e.g. --project=chromium-light -g Button]
#   --update  rewrites the baselines that differ or are missing (Playwright --update-snapshots=changed)
set -euo pipefail

app_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
repo_dir="$(cd "$app_dir/../.." && pwd)"

# The image tag must equal the installed Playwright version, or the bundled browsers will not match.
playwright_version="$(node -p "require('$app_dir/package.json').devDependencies['@playwright/test']")"
image="mcr.microsoft.com/playwright:v${playwright_version}-noble"

playwright_args=()
for arg in "$@"; do
  if [[ "$arg" == "--update" ]]; then
    playwright_args+=("--update-snapshots=changed")
  else
    playwright_args+=("$arg")
  fi
done

if ! command -v docker > /dev/null; then
  echo "Docker is required for the visual tests (they must run in $image)." >&2
  exit 1
fi

# node_modules and the yarn install state live in a Docker volume, so the Linux install never
# overwrites the host's own node_modules.
docker run --rm --init --ipc=host \
  -e CI=1 \
  -e HUSKY=0 \
  -e YARN_INSTALL_STATE_PATH=/work/node_modules/.yarn-install-state.gz \
  -v "$repo_dir:/work" \
  -v sui-visual-node-modules:/work/node_modules \
  -w /work \
  "$image" \
  bash -c 'set -euo pipefail
    yarn_release="$(ls .yarn/releases/yarn-*.cjs | head -n 1)"
    node "$yarn_release" install --immutable
    node "$yarn_release" workspace @khsura/sui test:visual:container "$@"' \
  visual ${playwright_args[@]+"${playwright_args[@]}"}

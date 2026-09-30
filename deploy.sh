#!/bin/bash
# Deploy Moodluma to Netlify (needs: npm i -g netlify-cli && netlify login once)
set -euo pipefail
cd "$(dirname "$0")"
if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "請先設定 NETLIFY_AUTH_TOKEN，或執行: netlify login"
  echo "取得 token: https://app.netlify.com/user/applications#personal-access-tokens"
  exit 1
fi
if ! command -v netlify >/dev/null 2>&1; then
  echo "安裝 Netlify CLI: npm install -g netlify-cli"
  exit 1
fi
netlify deploy --prod --dir=. --site=moodluma
echo "Done: https://moodluma.netlify.app/"

#!/usr/bin/env bash
# Run the auto-answer script locally against an existing issue.
#
# Usage: scripts/answer-local.sh <issue-number>
#
# Requires:
#   - gh CLI authenticated against karlmarx/mom-93fyi
#   - ANTHROPIC_API_KEY in env (or in .env)
#   - node available on PATH (Windows-side node.exe works in WSL)

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <issue-number>" >&2
  exit 1
fi

ISSUE=$1

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "ANTHROPIC_API_KEY not set. Add it to .env or export it." >&2
  exit 1
fi

GH_TOKEN_ANSWER=$(gh auth token)
export GH_TOKEN_ANSWER
export GH_TOKEN_BOT=$GH_TOKEN_ANSWER
export GITHUB_REPOSITORY=karlmarx/mom-93fyi
export ANTHROPIC_API_KEY

# Pick whatever node is on PATH; fall back to Windows-side node.exe if WSL.
if command -v node >/dev/null 2>&1; then
  NODE=node
elif [ -x "/mnt/c/Program Files/nodejs/node.exe" ]; then
  NODE="/mnt/c/Program Files/nodejs/node.exe"
else
  echo "node not found on PATH and not at /mnt/c/Program Files/nodejs/node.exe" >&2
  exit 1
fi

"$NODE" .github/scripts/answer-mom.mjs --issue "$ISSUE"

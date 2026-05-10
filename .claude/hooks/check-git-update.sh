#!/usr/bin/env bash
# PostToolUse hook for Bash. If the executed command was `git fetch` or `git pull`
# AND the output indicates new commits were fetched/pulled, emit a hookSpecificOutput
# JSON telling Claude to read baton.md.

set -e
input=$(cat)

cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

# Strict match: only when the EXECUTED command (not a quoted argument) is git fetch/pull.
# Allows: "git fetch", "git pull --rebase", "git -C /path fetch origin"
# Rejects: 'git commit -m "mentions git fetch"', 'git push'
if [[ "$cmd" =~ ^[[:space:]]*git([[:space:]]+-[Cc][[:space:]]+[^[:space:]]+)?[[:space:]]+(fetch|pull)([[:space:]]|$) ]]; then
    out=$(printf '%s' "$input" | jq -r '
      (.tool_response.stdout    // "") + "\n" +
      (.tool_response.stderr    // "") + "\n" +
      (.tool_response.output    // "")
    ')
    # Detect signals of actual updates:
    # - "Updating <sha>..<sha>"   (git pull fast-forward)
    # - " <sha>..<sha>"            (git fetch range)
    # - "Receiving objects"        (any fetch with new objects)
    # - "Unpacking objects"
    # - "Merge made"
    # Skip if "Already up to date." is present and no other signal.
    if printf '%s' "$out" | grep -qE 'Updating |\.\.[a-f0-9]{6,}|Receiving objects|Unpacking objects|Merge made'; then
      printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"git fetch/pull で更新を検出しました。baton.md を読んで最新の引き継ぎ情報を確認してください。"}}'
    fi
fi

#!/usr/bin/env bash
set -e

SESSION="simeon-cookie"
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── 1. Create session (detached) only if it doesn't exist ──────────────────
if ! tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux new-session -d -s "$SESSION"

  WIN=$(tmux list-windows -t "$SESSION" -F "#{window_index}" | head -1)

  # ── 2. Build layout while fully detached ─────────────────────────────────
  tmux split-window -h -p 50 -t "$SESSION:$WIN"
  tmux split-window -v -p 50 -t "$SESSION:$WIN.{right}"

  # ── 3. Send commands by position ─────────────────────────────────────────
  tmux send-keys -t "$SESSION:$WIN.{top-right}"  "bun dev" Enter
  tmux send-keys -t "$SESSION:$WIN.{left}" "claude" Enter
fi

# ── 4. Attach only after everything is set up ──────────────────────────────
if [ -n "$TMUX" ]; then
  tmux switch-client -t "$SESSION"
else
  tmux attach-session -t "$SESSION"
fi

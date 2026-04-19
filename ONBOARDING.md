# Welcome to SUI Team

## How We Use Claude

Based on Sura Kh's usage over the last 30 days:

Work Type Breakdown:
  Improve Quality  ████████░░░░░░░░░░░░  40%
  Plan Design      ████████░░░░░░░░░░░░  40%
  Debug Fix        ████░░░░░░░░░░░░░░░░  20%

Top Skills & Commands:
  /plugin  ████████████████████  2x/month
  /exit    ████████████████████  2x/month

Top MCP Servers:
  plugin_context-mode         ████████████████████  39 calls
  plugin_chrome-devtools-mcp  █░░░░░░░░░░░░░░░░░░░  2 calls
  claude-in-chrome            █░░░░░░░░░░░░░░░░░░░  1 call

## Your Setup Checklist

### Codebases
- [ ] khsura/sui — https://github.com/khsura/sui

### MCP Servers to Activate
- [ ] plugin_context-mode — Keeps large command output and web pages out of the context window by indexing them in a sandbox, so you can `ctx_search` later. Install via `/plugin marketplace add mksglu/context-mode` then `/plugin install context-mode@context-mode`.
- [ ] plugin_chrome-devtools-mcp — Chrome DevTools integration for browser automation, screenshots, performance traces, network inspection. Install via the Claude Code plugin marketplace.
- [ ] claude-in-chrome — Alternative browser integration through the Claude browser extension. Install the extension at https://claude.ai/chrome and log in with the same account.

### Skills to Know About
- `/plugin` — Install, list, update, and remove Claude Code plugins from marketplaces. The team uses it to install the `sui-plugin` from this repo's marketplace: `/plugin marketplace add khsura/sui` then `/plugin install sui-plugin@sui-framework`.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->

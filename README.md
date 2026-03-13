<div align="center">

# 🔥 Agni IDE

### India's first open source agentic IDE — powered by local Ollama

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue)](https://code.visualstudio.com/)
[![Ollama](https://img.shields.io/badge/Powered%20by-Ollama-black)](https://ollama.com/)
[![Build in Public](https://img.shields.io/badge/Building-In%20Public-orange)](https://twitter.com/)

> reads your codebase → plans changes → rewrites code → runs lint → self corrects on errors  
> all local. no API keys. no code leaves your machine.

**[Day 1 Build Log](#build-log) · [Architecture](#architecture) · [How it Works](#how-it-works) · [Install](#install) · [Roadmap](#roadmap)**

</div>

---

## What is Agni?

Agni is an agentic coding assistant that runs **completely on your machine** via Ollama. No subscriptions, no cloud, no code ever leaving your laptop.

It's not just autocomplete. It's a full agent loop — give it an instruction, it plans what to do, reads the relevant files, rewrites your code, verifies it with lint, and fixes its own mistakes if something breaks.

Currently a VS Code extension. Standalone IDE coming next.

---

## Why

Cursor costs $20/month and sends your code to US servers. Most Indian devs either pirate it or don't use it at all. Agni is the answer — open source, free forever, runs on your own hardware.

---

## Demo

```
Instruction: "add input validation and error handling to calculateTotal"

🧠 Planning...
⚡ read_file  →  /home/user/test.js
⚡ write_file →  complete rewrite with validation
🔍 run_command → eslint — 0 errors
✅ Done
```

**Before:**
```javascript
function calculateTotal(items) {
  let total = 0
  for (let item of items) {
    total += item.price
  }
  return total
}
```

**After:**
```javascript
function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Invalid input: items must be an array')
  }
  let total = 0
  for (let item of items) {
    if (typeof item.price !== 'number' || isNaN(item.price)) {
      throw new Error('Invalid item: each item must have a numeric price property')
    }
    total += item.price
  }
  return total
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VS Code Extension                    │
│                                                         │
│   ┌─────────────┐    ┌──────────────────────────────┐  │
│   │  Chat Panel  │    │       Agent Loop              │  │
│   │  (Webview)   │───▶│  PLAN → EXECUTE → VERIFY     │  │
│   │             │    │        → CORRECT → DONE       │  │
│   └─────────────┘    └──────────────┬───────────────┘  │
│                                      │                   │
│   ┌──────────────────────────────────▼───────────────┐  │
│   │                   Tool Layer                      │  │
│   │  read_file │ write_file │ apply_diff │ run_cmd   │  │
│   │  list_files │ search_in_files │ done             │  │
│   └──────────────────────────────────┬───────────────┘  │
└─────────────────────────────────────-│──────────────────┘
                                        │
                    ┌───────────────────▼────────────────┐
                    │           Ollama (local)            │
                    │      qwen2.5-coder:7b               │
                    │   localhost:11434  •  your GPU      │
                    └────────────────────────────────────┘
```

---

## How it Works

### The Agent Loop

The core of Agni is a state machine with 6 states:

```
PLAN ──▶ EXECUTE ──▶ VERIFY ──▶ DONE
                        │
                     (errors)
                        │
                     CORRECT ──▶ EXECUTE (retry, max 3x)
                        │
                     (max retries hit)
                        │
                      ERROR
```

**PLAN** — classifies the instruction, identifies which files are relevant, assembles context

**EXECUTE** — calls Ollama with a structured JSON prompt + tool definitions. The model responds with:
```json
{
  "thought": "I need to read the file first to understand the current implementation",
  "tool": "read_file",
  "args": { "path": "/home/user/src/index.ts" }
}
```

**VERIFY** — after every file write, runs ESLint on the modified file

**CORRECT** — if lint fails, the error is injected back into the conversation as a new message and the model retries. Max 3 attempts.

**DONE** — model calls the `done` tool with a summary. Loop exits.

---

### The Tool Layer

The agent has 7 tools available:

| Tool | Description |
|---|---|
| `read_file(path, startLine?, endLine?)` | Read a file, optionally a specific line range |
| `write_file(path, content)` | Write complete file content (used for files < 100 lines) |
| `apply_diff(path, diff)` | Apply a unified diff to a file (used for large files) |
| `list_files(path, extensions?)` | List all files in a directory recursively |
| `run_command(cmd, cwd?)` | Run a shell command — lint, test, build |
| `search_in_files(query, path)` | Search for text across all files |
| `done(summary)` | Mark task complete, exit loop |

---

### The Prompt Design

The system prompt forces structured JSON output with strict rules:

```
RULES:
1. Always respond with ONLY a single valid JSON object
2. Think step by step before acting
3. For files under 100 lines — always use write_file with complete content
4. After editing a file — always run_command to lint/typecheck it
5. If lint fails — fix the error and retry (max 3 attempts)
6. When task is done — call the "done" tool

RESPONSE FORMAT:
{
  "thought": "reasoning about what to do next",
  "tool": "tool_name",
  "args": { ...arguments... }
}
```

Low temperature (0.1) keeps the model deterministic and focused on code editing rather than creative output.

---

### Self-Correction Loop

This is the key accuracy feature. After every file write:

```
write_file("/src/index.ts", newContent)
        ↓
run_command("eslint /src/index.ts --max-warnings 0")
        ↓
  errors found?
     YES ──▶ inject error into conversation ──▶ model retries
     NO  ──▶ continue to next step
        ↓
  retries >= 3?
     YES ──▶ return ERROR state
     NO  ──▶ keep trying
```

The model sees its own mistakes and fixes them. No human intervention needed.

---

### Context Assembly

Current (v0.1) — instruction-based context:
- User specifies the file path in the instruction
- Agent reads the file on demand via `read_file`
- Agent can search across files via `search_in_files`

Coming (v0.2) — automatic context:
- Tree-sitter AST chunking at function/class boundaries
- LanceDB local vector store
- nomic-embed-text embeddings via Ollama
- Automatic retrieval of top-K relevant chunks at query time

---

## System Design

```
src/
├── extension.ts          # VS Code extension entry point
│                         # registers commands, status bar, chat panel
│
├── agent/
│   └── loop.ts           # Core agent state machine
│                         # Ollama streaming, JSON parsing, retry logic
│
├── tools/
│   └── index.ts          # All tool implementations
│                         # read_file, write_file, apply_diff, run_command
│                         # search_in_files, list_files
│
└── ui/
    └── chatPanel.ts      # Webview chat panel
                          # streaming token display, step visualization
                          # send/receive messages with extension host
```

### Key Design Decisions

**Why no LangChain or LangGraph?**  
Unnecessary complexity for this use case. A custom state machine is 100 lines of TypeScript and gives full control over every step. Frameworks add abstraction without adding value here.

**Why write_file over apply_diff for small files?**  
Diffs require exact line number matching. LLMs miscalculate line numbers frequently, especially after previous edits shift the file. For files under 100 lines, writing the complete corrected content is more reliable and produces zero duplicates.

**Why temperature 0.1?**  
Code editing needs determinism, not creativity. Lower temperature = model stays closer to the most likely correct output = fewer hallucinations = better accuracy.

**Why stream tokens?**  
Streaming gives the user live feedback that the model is working. For a 7B model on CPU this can take 10-30 seconds — streaming makes it feel responsive rather than frozen.

---

## Install

### Prerequisites

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a coding model
ollama pull qwen2.5-coder:7b
```

### Install Extension

Download `agni-ide-0.1.0.vsix` from releases, then:

```bash
code --install-extension agni-ide-0.1.0.vsix
```

Reload VS Code. Press `Ctrl+Shift+A` to open Agni.

### Configuration

In VS Code settings (`Ctrl+,`), search `agni`:

| Setting | Default | Description |
|---|---|---|
| `agni.ollamaUrl` | `http://localhost:11434` | Ollama server URL |
| `agni.model` | `qwen2.5-coder:7b` | Model to use |
| `agni.maxRetries` | `3` | Self-correction retry limit |

**Recommended models by hardware:**

| RAM | GPU VRAM | Recommended Model |
|---|---|---|
| 8GB | 4GB | `qwen2.5-coder:7b` |
| 16GB | 4-6GB | `qwen2.5-coder:7b` |
| 32GB | 8GB+ | `deepseek-coder-v2:16b` |

---

## Usage

Open any code file → select some code (optional) → press `Ctrl+Shift+A` → type your instruction.

**Examples:**
```
The file is /home/user/src/api/route.ts — add error handling to all async functions

The file is /home/user/src/utils.js — refactor this to TypeScript with proper types

The file is /home/user/src/components/Form.tsx — add form validation using zod
```

---

## Roadmap

### v0.1 (current) — Core Agent Loop
- [x] VS Code extension shell
- [x] Ollama integration with streaming
- [x] Full agent loop: PLAN → EXECUTE → VERIFY → CORRECT → DONE
- [x] Tool layer: read, write, diff, lint, search
- [x] Self-correction on lint errors (max 3 retries)
- [x] Live step visualization in chat panel

### v0.2 — Codebase Intelligence
- [ ] Tree-sitter AST chunking
- [ ] LanceDB local vector store
- [ ] Auto file detection from cursor position (no need to specify path)
- [ ] Semantic search across entire project
- [ ] Multi-file edits in one instruction

### v0.3 — Standalone IDE
- [ ] Electron shell with Monaco editor
- [ ] Built-in file tree and tabs
- [ ] Sarvam AI integration (India's own LLM)
- [ ] IndiaStack rule files (Razorpay, UPI, Aadhaar patterns)

### v1.0 — Agni IDE
- [ ] Full standalone IDE
- [ ] Fine-tuned model on Indian open source codebases
- [ ] ₹199/month cloud tier (free local tier always free)

---

## Build Log

**Day 1 (Mar 13, 2025)**
- built the core agent loop from scratch
- wired up Ollama streaming
- implemented all 7 tools
- got self-correction working
- packaged as VS Code extension
- first successful agentic edit on real code

---

## Contributing

open source, contributions welcome. still early so things will break.

```bash
git clone https://github.com/agni-ide/agni
cd agni
npm install
npm run watch   # compile in watch mode
# press F5 in VS Code to launch extension dev host
```

---

## License

MIT — free forever.

---

<div align="center">

built in India, for India 🇮🇳

</div>

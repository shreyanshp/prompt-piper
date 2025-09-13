# Prompt Piper CLI

A command-line tool for compressing AI prompts to reduce token usage and save costs.

## Two Modes

### 1. Command Mode (Quick Operations)
Run one-off compressions directly from the command line.

### 2. Interactive Mode (Terminal UI)
Full terminal interface with menu-driven options, similar to Claude.

## Installation

### From NPM (coming soon)
```bash
npm install -g prompt-piper-cli
```

### Local Development
```bash
cd cli
npm install
npm run build
npm link  # Makes 'prompt-piper' available globally
```

## Quick Start

### Interactive Mode (Recommended for demos)
```bash
# Start interactive terminal UI
prompt-piper interactive

# Or use the shortcut
ppi
```

### Command Mode
```bash
# Compress a prompt directly
prompt-piper compress "Could you please help me write detailed code?"

# From file
prompt-piper compress -f my-prompt.txt -o compressed.txt

# Pipe input
echo "verbose prompt here" | prompt-piper compress -q

# Analyze without compressing
prompt-piper analyze "My long prompt here"

# Side-by-side comparison
prompt-piper compare -f verbose.txt

# Show examples
prompt-piper examples
```

## Interactive Mode

The interactive mode provides a full terminal UI experience:

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║   ██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗                      ║
║   ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝                      ║
║   ██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║                         ║
║   ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║                         ║
║   ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║                         ║
║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝                         ║
╚═══════════════════════════════════════════════════════════════════════════════╝

MAIN MENU
────────────────────────────────────────
1) Compress Example 1: Verbose API Request
2) Compress Example 2: Over-polite Coding Request
3) Compress Example 3: Redundant Instructions

4) Enter Custom Prompt
5) View Compression Stats

H) Help
C) Clear Screen
Q) Quit
────────────────────────────────────────

prompt-piper>
```

### Features:
- **Menu-driven interface** - Simple numbered options
- **Built-in examples** - Test compression instantly
- **Custom prompt entry** - Enter multi-line prompts
- **Session statistics** - Track total savings
- **Visual compression** - See before/after with token bars
- **Help system** - Built-in documentation

### Usage:
```bash
# Start interactive mode
prompt-piper interactive

# Or use shortcut
ppi

# Navigate with:
# - Numbers (1-5) for options
# - H for help
# - C to clear screen
# - Q to quit
```

## Commands (Command Mode)

### `compress` (alias: `c`)
Compress a prompt to reduce token usage.

**Options:**
- `-f, --file <path>` - Read prompt from file
- `-o, --output <path>` - Save compressed prompt to file
- `-q, --quiet` - Only output the compressed prompt
- `-s, --stats` - Show detailed compression statistics

**Examples:**
```bash
prompt-piper compress "Please help me code"
prompt-piper c -f prompt.txt -s
prompt-piper compress -q "verbose text" > output.txt
```

### `analyze` (alias: `a`)
Analyze a prompt to see potential compression savings.

**Options:**
- `-f, --file <path>` - Read prompt from file

**Example:**
```bash
prompt-piper analyze -f my-long-prompt.txt
```

### `examples` (alias: `ex`)
Show example usage and sample compression results.

```bash
prompt-piper examples
```

## Usage Patterns

### 1. Interactive Development
```bash
# Quick compression
prompt-piper compress "Could you please help me write a very detailed guide?"

# Output: Write detailed guide.
# Stats: 68 → 19 tokens (-49 | 72.1%)
```

### 2. File Processing
```bash
# Process files
prompt-piper compress -f prompts/verbose.txt -o prompts/compressed.txt -s

# Batch processing
for file in prompts/*.txt; do
  prompt-piper compress -f "$file" -o "compressed/$(basename "$file")"
done
```

### 3. Pipeline Integration
```bash
# Part of a larger workflow
curl -s api.example.com/prompt | prompt-piper compress -q | ai-tool --stdin
```

### 4. Cost Analysis
```bash
# Analyze potential savings
prompt-piper analyze -f expensive-prompt.txt

# Output shows:
# Current tokens: 150
# After compression: 89 tokens (-61 tokens, 40.7% reduction)
# Cost savings: $0.0018 per request
```

## Sample Output

### Standard Compression
```
🎵 Prompt Piper Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Compressed Prompt:
Write stepwise guide implementing React authentication component.

Stats: 147 → 87 tokens (-60 | 40.8%)
```

### Detailed Stats (`-s` flag)
```
📊 Compression Stats:
Original tokens: 147
Compressed tokens: 87
Tokens saved: 60
Compression ratio: 40.8%
Cost savings: $0.0018 per request
```

### Analysis Mode
```
🎵 Prompt Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Current Stats:
Current tokens: 147
Estimated cost: $0.0044 per request

💡 Potential Savings:
After compression: 87 tokens
Tokens saved: 60
Compression ratio: 40.8%
Cost savings: $0.0018 per request

💰 Run prompt-piper compress to apply compression!
```

## How It Works

The CLI tool uses intelligent pattern matching to:

- Remove redundant phrases (`please`, `could you`, `I would like`)
- Compress verbose instructions (`step by step` → `stepwise`)
- Eliminate filler words (`very`, `really`, `quite`)
- Clean up excessive whitespace
- Preserve meaning and intent

## Integration Examples

### Shell Scripts
```bash
#!/bin/bash
# compress-and-send.sh
COMPRESSED=$(prompt-piper compress -q -f "$1")
echo "$COMPRESSED" | curl -X POST api.openai.com/chat -d @-
```

### CI/CD Pipeline
```yaml
- name: Optimize Prompts
  run: |
    find prompts/ -name "*.txt" -exec \
      prompt-piper compress -f {} -o optimized/{} \;
```

### Development Workflow
```bash
# Add to your shell profile
alias compress-prompt='prompt-piper compress -s'
alias analyze-prompt='prompt-piper analyze'
```

## Tips for Best Results

1. **Use with longer prompts** - Short prompts may not compress much
2. **Check with `-s` flag** - Verify compression maintains meaning
3. **Test compressed prompts** - Ensure AI response quality
4. **Batch process** - Use file options for multiple prompts
5. **Combine with cost monitoring** - Track actual API savings

---

Made for hackathons, optimized for production! 🚀


# prompt-piper

Prompt Piper プロンプト　パイパー | Compress LLM prompts to 4x your context window. Reduce API costs, slash latency, and unlock more powerful AI applications.

## Overview

Prompt Piper is a powerful CLI tool that intelligently compresses AI prompts, allowing you to:
- **4x your effective context window** - Fit more information into every API call
- **Reduce API costs** - Pay for fewer tokens while maintaining semantic meaning
- **Decrease latency** - Shorter prompts mean faster responses
- **Share compression rules** - Leverage community-optimized rule sets via IPFS

## Key Features

### 🎯 Smart Compression
- Advanced v3 compression algorithm with multiple rule set support
- Language-specific optimizations for Solidity, Go, Rust, Python, and more
- Preserves semantic meaning while reducing token count
- Real-time compression statistics and savings reports

### 🌐 Decentralized Rule Sharing (IPFS)
- Publish and share compression rule sets with the community
- Browse and download specialized rule sets for your use case
- Version control and updates for rule sets
- No central authority - fully decentralized

### 🚀 Multiple Usage Modes
- **Command Mode**: Direct integration into your workflow
- **Interactive Mode**: User-friendly terminal UI with guided options
- **Claude Launcher**: One-click integration with Claude AI
- **API Integration**: Use as a library in your own applications

### 📊 Real-time Analytics
- Token count reduction metrics
- Cost savings calculator
- Compression ratio analysis
- Before/after comparisons

## Quick Start

### Installation

```bash
# Using npm
npm install -g prompt-piper

# Using yarn
yarn global add prompt-piper

# Using bun
bun install -g prompt-piper
```

### Basic Usage

#### Command Mode (Direct Compression)

```bash
# Compress a single prompt
prompt-piper compress "Please analyze the following code and provide detailed feedback on performance optimizations"
# Output: "analyze code: feedback on perf optimizations"

# Compress from a file
prompt-piper compress -f long-prompt.txt -o compressed.txt

# Pipe input for compression
echo "Could you please help me understand this concept in detail?" | prompt-piper compress
# Output: "help understand concept"

# Analyze token savings without compressing
prompt-piper analyze "Your verbose prompt here"

# Compare before/after side-by-side
prompt-piper compare -f prompt.txt

# Use specific compression rules
prompt-piper compress "Your Solidity code review request" --rules solidity

# Quiet mode (only output compressed text)
prompt-piper compress -q "Please kindly assist me with this task"
# Output: assist with task
```

#### Interactive Mode (Terminal UI)

```bash
# Launch interactive terminal interface
prompt-piper interactive

# Or use the shortcut
ppi
```

#### Claude Integration

```bash
# Compress and launch with Claude
prompt-piper claude "Your prompt"
```

### IPFS Rule Sets

```bash
# Browse available rule sets
prompt-piper ipfs browse

# Download a rule set
prompt-piper ipfs get <CID>

# Publish your rule set
prompt-piper ipfs publish ./my-rules.json
```

## Documentation

- 📖 [CLI Documentation](./cli/README.md) - Comprehensive guide for all CLI features
- 🌐 [IPFS Rules Guide](./cli/IPFS_RULES_README.md) - Learn about decentralized rule sharing
- 🔧 [IPFS Setup](./cli/src/ipfs/README.md) - Installation and configuration for IPFS

## Example

```bash
# Original prompt (150 tokens)
$ prompt-piper compress "Please analyze the following code and provide detailed feedback on performance optimizations, potential bugs, and best practices..."

# Compressed output (38 tokens - 75% reduction!)
"analyze code: feedback on perf optimization, bugs, best practices..."

# Savings: $0.0015 per request
```

## Use Cases

- **Development**: Compress code snippets and technical documentation
- **Research**: Fit more papers and references into context
- **Creative Writing**: Include more backstory and world-building
- **Data Analysis**: Process larger datasets in single prompts
- **Multi-language**: Optimize prompts for specific programming languages

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-piper.git
cd prompt-piper

# Install dependencies
bun install

# Run in development mode
bun run dev
```

## Community

- 🌟 Star us on [GitHub](https://github.com/yourusername/prompt-piper)
- 🐛 Report issues in our [Issue Tracker](https://github.com/yourusername/prompt-piper/issues)
- 💬 Join our [Discord](https://discord.gg/promptpiper) for discussions
- 📧 Contact: promptpiper@example.com

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

Built with ❤️ by the Prompt Piper community. Special thanks to all contributors and rule set authors.

---

*Prompt Piper - Compress More, Pay Less, Build Faster*

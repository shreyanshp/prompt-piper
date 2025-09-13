# Prompt Piper

Prompt Piper プロンプト　パイパー | Compress LLM prompts to 4x your context window. Reduce API costs, slash latency, and unlock more powerful AI applications.

## What is Prompt Piper?

Prompt Piper is an intelligent prompt compression platform that helps developers and AI enthusiasts maximize their LLM interactions by:
- **4x your effective context window** - Fit more information into every API call
- **Reduce API costs** - Pay for fewer tokens while maintaining semantic meaning
- **Decrease latency** - Shorter prompts mean faster responses
- **Share compression expertise** - Leverage community-optimized rule sets

## Project Architecture

### 🖥️ CLI Tool (`/cli`)
Command-line interface for developers and power users.

**Key Features:**
- Interactive terminal UI with guided workflows
- Direct command-line compression
- IPFS-based rule set sharing and discovery
- Language-specific compression rules (Solidity, Go, Rust, Python, etc.)
- Integration with Claude AI and other LLMs
- Real-time compression analytics

**Quick Commands:**
```bash
cd cli && bun install

# Interactive mode
bun run interactive                    # Launch terminal UI
bun run interactive --claude           # Launch with Claude integration

# Direct compression
bun run compress "your prompt here"    # Compress text directly
bun run compress --rules solidity      # Use language-specific rules
bun run compress -f input.txt          # Compress from file

# Analysis & comparison
bun run analyze "your prompt"          # Show compression stats
bun run compare -f prompt.txt          # Before/after comparison

# IPFS rule sets
bun run ipfs:browse                    # Browse available rule sets
bun run ipfs:publish rules.json        # Share your rule set
```

📖 **[Full CLI Documentation →](./cli/README.md)**

### 🌐 Web Application (`/app`) *(Coming Soon)*
Browser-based interface for broader accessibility and team collaboration.

**Planned Features:**
- Visual compression editor
- Rule set marketplace and browser
- Team collaboration and sharing
- API integration dashboard
- Usage analytics and cost tracking
- Real-time collaboration on prompts

**Technology Stack:**
- Modern web framework (React/Next.js)
- Real-time compression engine
- IPFS integration for decentralized rule sharing
- Team management and permissions
- API for third-party integrations

## Core Technology

### 🎯 Smart Compression Engine
- Advanced v3 algorithm with semantic preservation
- Multiple rule set support for different use cases
- Language-specific optimizations
- Real-time token counting and savings calculation

### 🌐 Decentralized Rule Sharing (IPFS)
- Publish and discover compression rule sets
- Community-driven optimization patterns
- Version control for rule sets
- No central authority or vendor lock-in

### 📊 Analytics & Insights
- Token reduction metrics
- Cost savings calculator
- Compression effectiveness analysis
- Before/after comparisons

## Getting Started

### Developers & Power Users
Use the CLI tool for terminal-based workflows:
```bash
cd cli
bun install
bun run interactive
```

### Teams & Organizations
*Web application coming soon - designed for collaborative prompt engineering and team workflows*

### Integrations
Both CLI and web interfaces support:
- Claude AI integration
- Custom LLM endpoints
- API access for third-party tools
- IPFS rule set ecosystem

## Example Compression

```bash
# Original (127 tokens)
"Could you please provide a comprehensive analysis of the following Python code,
including detailed suggestions for performance optimizations, potential security
vulnerabilities, code style improvements, and best practices recommendations?"

# Compressed (23 tokens - 82% reduction!)
"analyze Python code: performance, security, style, best practices"

# Cost Savings: ~$0.002 per request with GPT-4
```

## Use Cases

- **Software Development**: Compress code snippets, documentation, and technical requests
- **Research & Analysis**: Fit more papers, data, and context into prompts
- **Content Creation**: Include extensive background and style guides
- **Data Science**: Process larger datasets in single API calls
- **Team Collaboration**: Share and optimize prompts across organizations

## Documentation

- 📖 **[CLI Tool Guide](./cli/README.md)** - Complete CLI documentation and usage
- 🌐 **[IPFS Rules System](./cli/IPFS_RULES_README.md)** - Decentralized rule sharing
- 🔧 **[IPFS Setup Guide](./cli/src/ipfs/README.md)** - Installation and configuration
- 📊 **[Compression Examples](./cli/examples/)** - Real-world use cases and demos

## Development

### CLI Development
```bash
cd cli
bun install
bun run dev
bun run build
```

### Web App Development
```bash
cd app
# Setup instructions coming soon
```

### Contributing
We welcome contributions to all parts of the Prompt Piper ecosystem:
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/yourusername/prompt-piper/issues)
- 💡 **Feature Requests**: Share your ideas in discussions
- 🔧 **Code Contributions**: Submit PRs for CLI, web app, or documentation
- 📝 **Rule Sets**: Contribute specialized compression rules via IPFS
- 📖 **Documentation**: Help improve guides and examples

## Roadmap

**Current (CLI)**
- ✅ Interactive terminal interface
- ✅ Command-line compression tools
- ✅ IPFS rule set sharing
- ✅ Language-specific optimizations
- ✅ Claude AI integration

**Upcoming (Web App)**
- 🚧 Browser-based compression interface
- 🚧 Visual rule set editor
- 🚧 Team collaboration features
- 🚧 API management dashboard
- 🚧 Enterprise deployment options

## Community & Support

- 🌟 **Star us on GitHub**: Help others discover Prompt Piper
- 💬 **Discord Community**: [discord.gg/promptpiper](https://discord.gg/promptpiper)
- 📧 **Contact**: promptpiper@example.com
- 🐦 **Twitter**: [@PromptPiper](https://twitter.com/PromptPiper)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ by the Prompt Piper community. Special thanks to:
- All contributors and rule set authors
- The IPFS community for decentralized infrastructure
- Claude AI and other LLM providers for inspiring better prompt engineering

---

*Prompt Piper - Compress More, Pay Less, Build Faster*
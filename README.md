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
A powerful command-line interface for developers and power users.

**Features:**
- Direct prompt compression from terminal
- Interactive terminal UI with guided workflows
- IPFS-based rule set sharing and discovery
- Language-specific compression rules (Solidity, Go, Rust, Python, etc.)
- Integration with Claude AI and other LLMs
- Real-time compression analytics

**Quick Start:**
```bash
# Install CLI tool
npm install -g prompt-piper

# Compress a prompt
prompt-piper compress "Your verbose prompt here"

# Launch interactive mode
prompt-piper interactive
```

📖 **[Full CLI Documentation →](./cli/README.md)**

### 🌐 Web Interface *(Coming Soon)*
A user-friendly web application for broader accessibility.

**Planned Features:**
- Browser-based prompt compression
- Visual compression editor
- Rule set marketplace
- Team collaboration features
- API integration dashboard
- Usage analytics and cost tracking

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

### For Developers (CLI)
```bash
# Install the CLI tool
npm install -g prompt-piper

# Start with interactive mode
prompt-piper interactive

# Or compress directly
prompt-piper compress "Please analyze this code and provide detailed feedback"
```

### For Teams (Web Interface)
*Coming soon - sign up for early access at [promptpiper.com](https://promptpiper.com)*

## Use Cases

- **Software Development**: Compress code snippets, documentation, and technical requests
- **Research & Analysis**: Fit more papers, data, and context into prompts  
- **Content Creation**: Include extensive background and style guides
- **Data Science**: Process larger datasets in single API calls
- **Multi-language Projects**: Optimize prompts for specific programming languages

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

## Documentation

- 📖 **[CLI Tool Guide](./cli/README.md)** - Complete CLI documentation and usage
- 🌐 **[IPFS Rules System](./cli/IPFS_RULES_README.md)** - Decentralized rule sharing
- 🔧 **[IPFS Setup Guide](./cli/src/ipfs/README.md)** - Installation and configuration
- 📊 **[Compression Examples](./cli/examples/)** - Real-world use cases and demos

## Development

### CLI Development
```bash
# Clone and setup
git clone https://github.com/yourusername/prompt-piper.git
cd prompt-piper/cli

# Install dependencies
bun install

# Run in development mode  
bun run dev

# Build for production
bun run build
```

### Web App Development
*Development setup coming soon*

## Contributing

We welcome contributions to all parts of the Prompt Piper ecosystem!

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/yourusername/prompt-piper/issues)
- 💡 **Feature Requests**: Share your ideas in our discussions
- 🔧 **Code Contributions**: Submit PRs for CLI tool, web interface, or documentation
- 📝 **Rule Sets**: Contribute specialized compression rules via IPFS
- 📖 **Documentation**: Help improve our guides and examples

## Community & Support

- 🌟 **Star us on GitHub**: Help others discover Prompt Piper
- 💬 **Discord Community**: [discord.gg/promptpiper](https://discord.gg/promptpiper)
- 📧 **Contact**: promptpiper@example.com
- 🐦 **Twitter**: [@PromptPiper](https://twitter.com/PromptPiper)

## Roadmap

- ✅ CLI Tool with IPFS integration
- ✅ Interactive terminal interface  
- ✅ Language-specific rule sets
- 🚧 Web interface and marketplace
- 🚧 API for third-party integrations
- 🚧 Team collaboration features
- 🚧 Enterprise deployment options

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ by the Prompt Piper community. Special thanks to:
- All contributors and rule set authors
- The IPFS community for decentralized infrastructure
- Claude AI and other LLM providers for inspiring better prompt engineering

---

*Prompt Piper - Compress More, Pay Less, Build Faster*
# IPFS Setup Guide for Prompt Piper

This guide will help you set up IPFS to use the advanced rule set sharing features in Prompt Piper.

## Quick Setup

### 1. Install IPFS

**macOS (using Homebrew):**
```bash
brew install ipfs
```

**Linux:**
```bash
# Download and install
wget https://dist.ipfs.io/go-ipfs/v0.20.0/go-ipfs_v0.20.0_linux-amd64.tar.gz
tar -xzf go-ipfs_v0.20.0_linux-amd64.tar.gz
cd go-ipfs
sudo ./install.sh
```

**Windows:**
1. Download from [https://dist.ipfs.io/go-ipfs/v0.20.0/go-ipfs_v0.20.0_windows-amd64.zip](https://dist.ipfs.io/go-ipfs/v0.20.0/go-ipfs_v0.20.0_windows-amd64.zip)
2. Extract and add to PATH

### 2. Initialize IPFS

```bash
ipfs init
```

### 3. Start IPFS Daemon

```bash
ipfs daemon
```

Keep this terminal open - the daemon needs to stay running.

### 4. Verify Installation

In a new terminal:
```bash
ipfs id
```

You should see your IPFS node information.

## Install Prompt Piper Dependencies

```bash
cd /path/to/prompt-piper/cli
bun install
```

## Test IPFS Integration

```bash
# Run the IPFS demo
bun run demo:ipfs

# Or test with CLI commands
prompt-piper rules:list
```

## Troubleshooting

### IPFS Daemon Won't Start

**Port already in use:**
```bash
# Kill existing IPFS processes
pkill ipfs

# Or use different ports
ipfs daemon --api /ip4/127.0.0.1/tcp/5002
```

**Permission issues:**
```bash
# Fix IPFS directory permissions
sudo chown -R $USER ~/.ipfs
```

### Connection Issues

**Check IPFS status:**
```bash
ipfs stats repo
ipfs config show
```

**Reset IPFS (if needed):**
```bash
ipfs shutdown
rm -rf ~/.ipfs
ipfs init
ipfs daemon
```

## Usage Examples

Once IPFS is running, you can:

```bash
# List available rule sets
prompt-piper rules:list

# Use language-specific compression
prompt-piper compress-v3 "Write a Solidity smart contract" --language solidity

# Store and share rule sets
prompt-piper rules:store builtin-code
# Share the CID with others

# Load community rule sets
prompt-piper rules:load <community-cid>
```

## Next Steps

1. **Explore Built-in Rules**: `prompt-piper rules:list`
2. **Try Language-Specific Compression**: Use `--language` option
3. **Create Custom Rules**: `prompt-piper rules:create`
4. **Share with Community**: Store rules and share CIDs
5. **Join the Community**: Share your rule sets and discover others'

## Need Help?

- Check the [IPFS Documentation](https://docs.ipfs.io/)
- Run `prompt-piper --help` for CLI options
- See `IPFS_RULES_README.md` for detailed usage
- Open an issue on GitHub for bugs or feature requests

---

**Happy Compressing!** 🚀

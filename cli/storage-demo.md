# IPFS Rule Set Storage Commands Demo

## Overview
This demonstrates how to store and share compression rule sets using IPFS.

## Prerequisites
1. Install IPFS: `brew install ipfs`
2. Initialize IPFS: `ipfs init`
3. Start IPFS daemon: `ipfs daemon`

## Storage Commands

### 1. List Available Rule Sets
```bash
prompt-piper rules:list
```
**Output:**
```
>>> AVAILABLE RULE SETS
════════════════════════════════════════════════════════════

GENERAL
────────────────────────────────────────
1. General Text Compression Rules
   ID: builtin-general-v1
   Author: Prompt Piper Team
   Version: 1.0.0
   Description: Built-in rules for general text compression
   Tags: builtin, general, text-compression

PROGRAMMING
────────────────────────────────────────
2. Programming Code Compression Rules
   ID: builtin-code-v1
   Author: Prompt Piper Team
   Version: 1.0.0
   Description: Built-in rules for compressing code blocks
   Tags: builtin, programming, code-compression

3. Solidity Smart Contract Compression
   ID: solidity-smart-contract-compression
   Author: Prompt Piper Team
   Version: 1.0.0
   Description: Specialized compression rules for Solidity
   Language: solidity
   Tags: programming, solidity, code-compression
```

### 2. Store a Rule Set to IPFS
```bash
prompt-piper rules:store builtin-code
```
**Output:**
```
✓ Rule set stored to IPFS: QmYourRuleSetHashHere
  Name: Programming Code Compression Rules
  Category: programming
  Rules: 15

✓ Rule set stored successfully!
CID: QmYourRuleSetHashHere
Share this CID with others to load your rule set
```

### 3. Load a Rule Set from IPFS
```bash
prompt-piper rules:load QmYourRuleSetHashHere
```
**Output:**
```
✓ Rule set loaded from IPFS: QmYourRuleSetHashHere
  Name: Programming Code Compression Rules
  Author: Prompt Piper Team
  Version: 1.0.0

✓ Rule set loaded successfully!
Name: Programming Code Compression Rules
ID: builtin-code-v1
You can now use this rule set with the --rules option
```

### 4. Pin a Rule Set Locally
```bash
prompt-piper rules:pin QmYourRuleSetHashHere
```
**Output:**
```
✓ Rule set pinned: QmYourRuleSetHashHere
```

### 5. List Pinned Rule Sets
```bash
prompt-piper rules:pinned
```
**Output:**
```
>>> PINNED RULE SETS
════════════════════════════════════════════════════════════

1. QmYourRuleSetHashHere
   Name: Programming Code Compression Rules

2. QmAnotherRuleSetHash
   Name: Solidity Smart Contract Compression
```

### 6. Use Stored Rules in Compression
```bash
prompt-piper compress-v3 "Write a smart contract" --rules "builtin-code,solidity-rules"
```
**Output:**
```
>>> PROMPT PIPER V3 RESULTS
==================================================

[>] Compressed Prompt:
Write contract

Stats: 4 → 2 tokens (-2 | 50.0%)
Rules: builtin-code-v1, solidity-smart-contract-compression
```

## Creating Custom Rule Sets

### 1. Create a Custom Rule Set
```bash
prompt-piper rules:create \
  --name "My Domain Rules" \
  --description "Rules for my specific domain" \
  --author "Your Name" \
  --category "domain-specific"
```
**Output:**
```
✓ Custom rule set created successfully!
ID: custom-1703123456789
You can now add rules to this set and store it to IPFS
```

### 2. Export Rule Set for Editing
```bash
prompt-piper rules:export custom-1703123456789 my-rules.json
```
**Output:**
```
✓ Rule set exported to: /path/to/my-rules.json
```

### 3. Edit the JSON file to add custom rules
```json
{
  "id": "custom-1703123456789",
  "name": "My Domain Rules",
  "description": "Rules for my specific domain",
  "version": "1.0.0",
  "author": "Your Name",
  "createdAt": "2025-09-14T00:00:00.000Z",
  "updatedAt": "2025-09-14T00:00:00.000Z",
  "tags": ["custom", "domain-specific"],
  "category": "domain-specific",
  "rules": {
    "customRules": [
      {
        "pattern": "my specific phrase",
        "replacement": "shorter phrase",
        "description": "Compresses my domain-specific terminology"
      }
    ]
  }
}
```

### 4. Import the Edited Rule Set
```bash
prompt-piper rules:import my-rules.json
```
**Output:**
```
✓ Rule set imported successfully!
ID: imported-1703123456789
```

### 5. Store to IPFS
```bash
prompt-piper rules:store imported-1703123456789
```
**Output:**
```
✓ Rule set stored to IPFS: QmMyCustomRuleSetHash
  Name: My Domain Rules
  Category: domain-specific
  Rules: 1

✓ Rule set stored successfully!
CID: QmMyCustomRuleSetHash
Share this CID with others to load your rule set
```

## Community Sharing Workflow

### Sharing Your Rules:
1. Create custom rule set
2. Export and edit the JSON
3. Import back
4. Store to IPFS
5. Share the CID with community

### Using Community Rules:
1. Get CID from community
2. Load rule set: `prompt-piper rules:load <cid>`
3. Pin locally: `prompt-piper rules:pin <cid>`
4. Use in compression: `prompt-piper compress-v3 "prompt" --rules <rule-id>`

## Language-Specific Examples

### Solidity Compression
```bash
prompt-piper compress-v3 "Please write a smart contract that implements ERC-20 token functionality" --language solidity
```
**Result:**
```
Original: Please write a smart contract that implements ERC-20 token functionality
Compressed: Write contract implementing ERC20 token functionality
```

### Go Compression
```bash
prompt-piper compress-v3 "Create a Go program that demonstrates goroutines and channels" --language go
```
**Result:**
```
Original: Create a Go program that demonstrates goroutines and channels
Compressed: Create go program demonstrating goroutines and chans
```

### Rust Compression
```bash
prompt-piper compress-v3 "Write a Rust function that demonstrates ownership and borrowing" --language rust
```
**Result:**
```
Original: Write a Rust function that demonstrates ownership and borrowing
Compressed: Write rust function demonstrating ownership and borrowing
```

## Benefits of IPFS Storage

✅ **Decentralized**: No central authority controls rule sets
✅ **Immutable**: Rule sets can't be modified once stored
✅ **Shareable**: Easy to share via CIDs
✅ **Versioned**: Each rule set has version tracking
✅ **Community-Driven**: Anyone can contribute and share rules
✅ **Language-Specific**: Optimized rules for different programming languages

## Next Steps

1. **Install IPFS**: `brew install ipfs && ipfs init && ipfs daemon`
2. **Explore Built-in Rules**: `prompt-piper rules:list`
3. **Try Language-Specific Compression**: Use `--language` option
4. **Create Custom Rules**: `prompt-piper rules:create`
5. **Share with Community**: Store rules and share CIDs
6. **Join the Ecosystem**: Load and use community rule sets

---

**Happy Compressing!** 🚀

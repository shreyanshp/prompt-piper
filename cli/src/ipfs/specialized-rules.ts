import { CompressionRuleSet, RuleSetBuilder } from './ipfs-manager';

export class SpecializedRuleSets {

    static createSolidityRuleSet(): CompressionRuleSet {
        const ruleSet = RuleSetBuilder.createProgrammingRuleSet(
            'Solidity Smart Contract Compression',
            'Specialized compression rules for Solidity smart contract development prompts',
            'Prompt Piper Team',
            'solidity'
        );

        // Override with predictable ID
        ruleSet.id = 'solidity-smart-contract-compression';

        // Add IPFS address to metadata
        const ipfsAddress = 'ipfs://<CID>.json';

        ruleSet.rules = {
            redundantPhrases: [
                { pattern: 'write a smart contract that', replacement: 'write contract to' },
                { pattern: 'create a function that will', replacement: 'create function to' },
                { pattern: 'implement a modifier that', replacement: 'implement modifier to' },
                { pattern: 'make sure the contract', replacement: 'ensure contract' },
                { pattern: 'the following contract', replacement: 'this contract' },
                { pattern: 'in the contract above', replacement: 'in contract' },
                { pattern: 'as shown in the example', replacement: 'as shown' },
                { pattern: 'Here\'s an example of how', replacement: 'Example:' },
                { pattern: 'Consider the following implementation', replacement: 'Consider implementation:' },
                { pattern: 'The contract below demonstrates', replacement: 'Contract demonstrates' },
                { pattern: 'This is how you would', replacement: 'To' },
                { pattern: 'please write a', replacement: 'write' },
                { pattern: 'could you create a', replacement: 'create' },
                { pattern: 'I would like you to', replacement: '' },
                { pattern: 'can you help me with', replacement: '' }
            ],
            commonPhrases: [
                { pattern: 'as much detail as possible', replacement: 'detailed' },
                { pattern: 'step by step', replacement: 'stepwise' },
                { pattern: 'make sure that', replacement: 'ensure' },
                { pattern: 'it is important that', replacement: 'importantly,' },
                { pattern: 'keep in mind that', replacement: 'note:' },
                { pattern: 'gas optimization', replacement: 'gas-opt' },
                { pattern: 'security best practices', replacement: 'security' },
                { pattern: 'smart contract security', replacement: 'contract security' },
                { pattern: 'decentralized application', replacement: 'dapp' },
                { pattern: 'blockchain technology', replacement: 'blockchain' }
            ],
            fillerWords: [
                { pattern: 'very', replacement: '' },
                { pattern: 'really', replacement: '' },
                { pattern: 'quite', replacement: '' },
                { pattern: 'rather', replacement: '' },
                { pattern: 'pretty', replacement: '' },
                { pattern: 'actually', replacement: '' },
                { pattern: 'basically', replacement: '' },
                { pattern: 'essentially', replacement: '' },
                { pattern: 'literally', replacement: '' }
            ],
            instructions: [
                { pattern: 'provide me with', replacement: 'provide' },
                { pattern: 'give me', replacement: 'provide' },
                { pattern: 'explain to me', replacement: 'explain' },
                { pattern: 'show me how to', replacement: 'show how to' },
                { pattern: 'help me understand', replacement: 'explain' }
            ],
            conjunctions: [
                { pattern: '\\. And ', replacement: '. ' },
                { pattern: '\\. Also, ', replacement: '. ' },
                { pattern: '\\. Additionally, ', replacement: '. ' },
                { pattern: '\\. Furthermore, ', replacement: '. ' },
                { pattern: '\\. Moreover, ', replacement: '. ' }
            ],
            codingPhrases: [
                { pattern: 'pragma solidity', replacement: 'pragma' },
                { pattern: 'contract.*\\{', replacement: 'contract {' },
                { pattern: 'function.*\\{', replacement: 'function {' },
                { pattern: 'modifier.*\\{', replacement: 'modifier {' },
                { pattern: 'event.*;', replacement: 'event;' },
                { pattern: 'mapping.*;', replacement: 'mapping;' },
                { pattern: 'struct.*\\{', replacement: 'struct {' }
            ],
            customRules: [
                { pattern: 'ERC-20', replacement: 'ERC20' },
                { pattern: 'ERC-721', replacement: 'ERC721' },
                { pattern: 'ERC-1155', replacement: 'ERC1155' },
                { pattern: 'OpenZeppelin', replacement: 'OZ' },
                { pattern: 'ethereum', replacement: 'eth' },
                { pattern: 'blockchain', replacement: 'chain' },
                { pattern: 'cryptocurrency', replacement: 'crypto' },
                { pattern: 'decentralized', replacement: 'decentralized' },
                { pattern: 'immutable', replacement: 'immutable' },
                { pattern: 'payable', replacement: 'payable' }
            ]
        };

        ruleSet.metadata = {
            compressionRatio: 0.25,
            testCases: [
                {
                    input: 'Please write a smart contract that implements an ERC-20 token with the following features: minting, burning, and transfer functionality. Make sure the contract follows security best practices and is gas optimized.',
                    expected: 'Write contract implementing ERC20 token with minting, burning, transfer. Ensure security and gas-opt.'
                }
            ],
            usage: 0,
            rating: 0,
            ipfsAddress: ipfsAddress
        };

        return ruleSet;
    }

    static getAllSpecializedRuleSets(): CompressionRuleSet[] {
        return [
            this.createSolidityRuleSet(),
        ];
    }
}

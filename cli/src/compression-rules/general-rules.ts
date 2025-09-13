export const generalRules = {
    // Remove redundant phrases
    redundantPhrases: [
        { pattern: /please (kindly )?/gi, replacement: '' },
        { pattern: /could you (please )?/gi, replacement: '' },
        { pattern: /I would like you to /gi, replacement: '' },
        { pattern: /can you help me (with|to) /gi, replacement: '' },
    ],

    // Compress common phrases
    commonPhrases: [
        { pattern: /as much detail as possible/gi, replacement: 'detailed' },
        { pattern: /step by step/gi, replacement: 'stepwise' },
        { pattern: /make sure (that )?/gi, replacement: 'ensure ' },
        { pattern: /it is important (that|to)/gi, replacement: 'importantly,' },
        { pattern: /keep in mind (that )?/gi, replacement: 'note: ' },
    ],

    // Remove filler words
    fillerWords: [
        { pattern: /\b(very|really|quite|rather|pretty)\s+/gi, replacement: '' },
        { pattern: /\b(actually|basically|essentially|literally)\s+/gi, replacement: '' },
    ],

    // Compress instructions
    instructions: [
        { pattern: /provide me with/gi, replacement: 'provide' },
        { pattern: /give me/gi, replacement: 'provide' },
        { pattern: /explain to me/gi, replacement: 'explain' },
    ],

    // Remove redundant conjunctions
    conjunctions: [
        { pattern: /\. And /gi, replacement: '. ' },
        { pattern: /\. Also, /gi, replacement: '. ' },
        { pattern: /\. Additionally, /gi, replacement: '. ' },
    ],

    // Whitespace normalization
    whitespace: [
        { pattern: /\s+/g, replacement: ' ' },
    ]
};

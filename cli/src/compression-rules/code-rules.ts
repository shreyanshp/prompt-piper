export const codeRules = {
    // Coding-specific phrase compression
    codingPhrases: [
        { pattern: /write a function that will/gi, replacement: 'write function to' },
        { pattern: /create a script that/gi, replacement: 'create script to' },
        { pattern: /implement a solution that/gi, replacement: 'implement solution to' },
        { pattern: /make sure the code/gi, replacement: 'ensure code' },
        { pattern: /the following code/gi, replacement: 'this code' },
        { pattern: /in the code above/gi, replacement: 'in code' },
        { pattern: /as shown in the example/gi, replacement: 'as shown' },
        { pattern: /Here's an example of how/gi, replacement: 'Example:' },
        { pattern: /Here is an example of/gi, replacement: 'Example:' },
        { pattern: /Consider the following implementation/gi, replacement: 'Consider implementation:' },
        { pattern: /The code below demonstrates/gi, replacement: 'Code demonstrates' },
        { pattern: /This is how you would/gi, replacement: 'To' },
    ],

    // Code block compression rules
    codeBlockCompression: {
        // Remove comments
        removeComments: [
            { pattern: /^\s*\/\/.*$/gm, type: 'single-line-js' },
            { pattern: /\/\*[\s\S]*?\*\//g, type: 'multi-line-js' },
            { pattern: /^\s*#.*$/gm, type: 'python-shell' },
            { pattern: /<!--[\s\S]*?-->/g, type: 'html' },
        ],

        // Whitespace compression
        whitespace: [
            { pattern: /\n\s*\n/g, replacement: '\n' }, // Remove empty lines
            { pattern: /\s+$/gm, replacement: '' }, // Remove trailing spaces
            { pattern: /^\t+/gm, replacement: '  ' }, // Convert tabs to 2 spaces
        ],

        // Language-specific rules
        languages: {
            javascript: {
                minify: true,
                preserveStructure: true,
            },
            python: {
                preserveIndentation: true,
                removeDocstrings: false, // Keep docstrings for clarity
            },
            html: {
                collapseWhitespace: true,
                removeComments: true,
            }
        }
    }
};

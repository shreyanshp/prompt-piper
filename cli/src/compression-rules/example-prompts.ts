export const dramaticExamples = [
    {
        title: 'Verbose React Component Request',
        prompt: `Could you please help me write a very detailed step by step guide on how to make sure that I can actually implement a React component that is really quite complex and basically handles user authentication? Please make sure that you provide me with as much detail as possible, including all the necessary imports, state management, and event handlers. I would really appreciate it if you could also show me how to properly handle errors and make sure the component is actually quite performant. Also, please keep in mind that I'm actually pretty new to React development, so I would like you to explain everything in a way that is very clear and easy to understand.

Here's an example of what I'm thinking about:

\`\`\`javascript
// This is just a basic example
import React from 'react';

class AuthComponent extends React.Component {
    constructor(props) {
        super(props);
        // I need help with the state here
        this.state = {
            // What should go here?
        };
    }

    // I need methods for handling login
    handleLogin = () => {
        // What should this do?
    }

    render() {
        return (
            <div>
                {/* What should the UI look like? */}
            </div>
        );
    }
}
\`\`\`

Could you please make sure to include proper error handling and validation?`
    },

    {
        title: 'Verbose CSS Styling Request',
        prompt: `I would really like you to help me create a comprehensive CSS stylesheet that will basically style a modern dashboard interface. Please make sure that you include all the necessary styles for responsive design and make sure everything looks very professional and polished.

Here is an example of the structure I'm working with:

\`\`\`css
/* Main dashboard container with full height and modern styling */
.dashboard-container {
    width: 100%;
    height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Header section with gradient background and shadows */
.dashboard-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 30px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Sidebar navigation with hover effects and transitions */
.dashboard-sidebar {
    width: 250px;
    background-color: #2c3e50;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    padding-top: 60px;
    transition: all 0.3s ease;
}

/* Main content area with proper spacing and layout */
.dashboard-main {
    margin-left: 250px;
    padding: 30px;
    flex: 1;
    overflow-y: auto;
    background-color: #ffffff;
}
\`\`\`

Could you please provide a complete stylesheet with responsive breakpoints and hover animations?`
    },

    {
        title: 'Complex Solidity Smart Contract',
        prompt: `Could you please tell me if there are any issues or vulnerabilities with this Solidity smart contract that I'm thinking about deploying? I would really appreciate it if you could carefully review it and let me know if there are any security concerns.

Here is the contract:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DecentralizedVoting
 * @dev A comprehensive voting contract with multiple security features
 * @author Your Name Here
 */
contract DecentralizedVoting {

    // Struct to represent a candidate in the voting system
    struct Candidate {
        uint256 id;           // Unique identifier for the candidate
        string name;          // Full name of the candidate
        string description;   // Detailed description of the candidate
        uint256 voteCount;    // Current number of votes received
        bool isActive;        // Whether the candidate is still active
    }

    // Struct to represent a voter in the system
    struct Voter {
        bool isRegistered;    // Whether the voter is registered
        bool hasVoted;        // Whether the voter has already voted
        uint256 votedFor;     // ID of the candidate they voted for
        uint256 registrationTime; // When they registered
    }

    // State variables for the contract
    address public owner;                           // Contract owner address
    string public votingTitle;                      // Title of the voting event
    uint256 public votingStartTime;                 // When voting starts
    uint256 public votingEndTime;                   // When voting ends
    uint256 public totalVotes;                      // Total number of votes cast

    // Mappings to store data
    mapping(address => Voter) public voters;       // Address to Voter mapping
    mapping(uint256 => Candidate) public candidates; // ID to Candidate mapping
    uint256 public candidateCount;                  // Total number of candidates

    // Events for logging important actions
    event VoterRegistered(address indexed voter, uint256 timestamp);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed candidateId, string name);

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // Modifier to check if voting is currently active
    modifier votingActive() {
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Voting is not currently active");
        _;
    }
}
\`\`\`

Please only reply with whether you found any issues or vulnerabilities (yes/no) and if yes, list them briefly.`
    }
];

export const simpleExamples = [
    {
        title: 'Verbose API Request',
        prompt: 'Could you please help me write a very detailed step by step guide on how to make sure that I can actually implement a REST API endpoint that is really quite secure and basically handles user authentication properly?'
    },
    {
        title: 'Over-polite Coding Request',
        prompt: 'I would really appreciate it if you could please provide me with a comprehensive tutorial on machine learning algorithms. Could you help me understand the differences and make sure to explain everything very clearly?'
    },
    {
        title: 'Redundant Instructions',
        prompt: 'Can you help me to create a Python script that actually reads data from a CSV file? Please make sure that it handles errors very carefully and basically validates all the input data. Keep in mind performance is quite important.'
    }
];

export const codeExamples = dramaticExamples;

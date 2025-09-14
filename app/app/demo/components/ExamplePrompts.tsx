'use client'

interface ExamplePromptsProps {
    onSelectExample: (prompt: string) => void
}

const EXAMPLE_PROMPTS = [
    {
        id: 1,
        title: 'Simple Task',
        description: 'Basic prompt with redundant phrases',
        prompt: `Please help me write a comprehensive and detailed summary of the main key points and important aspects of machine learning, including but not limited to the various different types and categories of machine learning algorithms, their practical applications in real-world scenarios, and the benefits and advantages they provide to businesses and organizations in today's modern digital landscape.`
    },
    {
        id: 2,
        title: 'Code Review',
        description: 'Programming-related prompt with code blocks',
        prompt: `Please review this Python code and provide detailed feedback on improvements, best practices, and potential issues:

\`\`\`python
# This function calculates the factorial of a number
def calculate_factorial(n):
    # Check if the input is valid
    if n < 0:
        # Return error for negative numbers
        return "Error: Cannot calculate factorial of negative number"
    elif n == 0:
        # Base case: factorial of 0 is 1
        return 1
    else:
        # Recursive case: n! = n * (n-1)!
        result = 1
        for i in range(1, n + 1):
            result = result * i
        return result
\`\`\`

I would really appreciate if you could take a look at this code and let me know what you think about it, and please provide any suggestions for improvements or optimizations that might make it better.`
    },
    {
        id: 3,
        title: 'Business Analysis',
        description: 'Long-form business prompt with repetitive content',
        prompt: `I need your help to create a comprehensive business plan for a new startup company. The business plan should include all the necessary components and elements that are typically found in professional business plans. Please make sure to cover the executive summary, market analysis, competitive analysis, marketing strategy, operations plan, management team, financial projections, and funding requirements. It's very important that this business plan is thorough and complete, as it will be used to present to potential investors and stakeholders. The startup is in the technology sector, specifically focusing on artificial intelligence solutions for small and medium-sized businesses.`
    },
    {
        id: 4,
        title: 'Technical Documentation',
        description: 'Complex technical prompt with specifications',
        prompt: `Please help me create comprehensive technical documentation for a REST API. The documentation should include detailed information about all endpoints, request/response formats, authentication methods, error handling, rate limiting, and best practices for integration. Here are the specific requirements and details:

- Authentication: JWT tokens with refresh mechanism
- Base URL: https://api.example.com/v1
- Supported formats: JSON only
- Rate limiting: 1000 requests per hour per API key
- Error codes: Standard HTTP status codes with custom error messages

The API has the following endpoints:
- GET /users - Retrieve all users
- GET /users/{id} - Retrieve specific user
- POST /users - Create new user
- PUT /users/{id} - Update existing user
- DELETE /users/{id} - Delete user

Please make sure the documentation is clear, comprehensive, and includes practical examples for each endpoint.`
    }
]

export default function ExamplePrompts({ onSelectExample }: ExamplePromptsProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4 font-title">Try Example Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXAMPLE_PROMPTS.map((example) => (
                    <button
                        key={example.id}
                        onClick={() => onSelectExample(example.prompt)}
                        className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
                    >
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700">
                            {example.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            {example.description}
                        </p>
                        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 font-mono line-clamp-3">
                            {example.prompt.substring(0, 120)}...
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
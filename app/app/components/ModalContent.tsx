'use client'

import Image from 'next/image'

// Principal Modal Content
export function PrincipalModalContent() {
    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Our Principal</h3>
            <p className="mb-4">
                Prompt Piper is built on the principle of making AI more accessible and cost-effective for everyone. 
                We believe that advanced language models should be available to developers, researchers, and businesses 
                of all sizes without the barrier of high token costs.
            </p>
            <p className="mb-4">
                Our core mission is to democratize AI by providing intelligent compression solutions that reduce 
                token usage while maintaining the quality and effectiveness of AI interactions.
            </p>
            <p>
                Through innovative compression algorithms and decentralized storage, we're creating a more 
                sustainable and accessible future for AI applications.
            </p>
        </>
    )
}

// Team Modal Content
export function TeamModalContent() {
    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Bitcoin.com Stallions</h3>
            <p className="mb-6">
                Our team consists of passionate developers and blockchain experts from{' '}
                <a 
                    href="https://bitcoin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold underline"
                >
                    Bitcoin.com
                </a>
                {' '}who are dedicated to solving the challenges of AI accessibility and cost optimization.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Team Member 1 */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/images/avatar-01.jpg"
                            alt="Team Member 1"
                            width={60}
                            height={60}
                            className="rounded-full mr-4"
                        />
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Alex Chen</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">Lead Developer</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        Blockchain architect with 8+ years of experience in distributed systems and AI optimization. 
                        Passionate about making AI accessible to everyone.
                    </p>
                    <a 
                        href="https://github.com/alexchen" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                    >
                        View GitHub →
                    </a>
                </div>

                {/* Team Member 2 */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/images/avatar-02.jpg"
                            alt="Team Member 2"
                            width={60}
                            height={60}
                            className="rounded-full mr-4"
                        />
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah Kim</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">AI Research Lead</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        Machine learning expert specializing in prompt optimization and token compression. 
                        Former researcher at leading AI labs with focus on efficiency.
                    </p>
                    <a 
                        href="https://github.com/sarahkim" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                    >
                        View GitHub →
                    </a>
                </div>
            </div>
        </>
    )
}

// Stats Modal Content
export function StatsModalContent() {
    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Platform Statistics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">60%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Compression</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">$2.3M</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Costs Saved</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">10K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
            </div>
            <p>
                These statistics reflect our commitment to providing reliable, efficient, and cost-effective 
                AI compression solutions to our growing community.
            </p>
        </>
    )
}

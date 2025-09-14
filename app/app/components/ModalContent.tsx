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
                                   alt="Vitalik Marincenko"
                                   width={60}
                                   height={60}
                                   className="rounded-full mr-4"
                               />
                               <div>
                                   <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Vitalik Marincenko</h4>
                                   <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">Lead Developer</p>
                               </div>
                           </div>
                           <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                               Decentralized Builder and Solidity/Web3 expert at Bitcoin.com.
                               Passionate about making AI accessible through blockchain technology and compression optimization.
                           </p>
                           <a
                               href="https://github.com/vm06007"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                           >
                               @vm06007 →
                           </a>
                       </div>

                       {/* Team Member 2 */}
                       <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                           <div className="flex items-center mb-4">
                               <Image
                                   src="/images/avatar-02.jpg"
                                   alt="Shreyansh Pandey"
                                   width={60}
                                   height={60}
                                   className="rounded-full mr-4"
                               />
                               <div>
                                   <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Shreyansh Pandey</h4>
                                   <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">AI Research Lead</p>
                               </div>
                           </div>
                           <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                               Machine learning expert specializing in prompt optimization and token compression.
                               Developer Program Member with focus on AI efficiency and real-time applications.
                           </p>
                           <a
                               href="https://github.com/shreyanshp"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                           >
                               @shreyanshp →
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
            {/* Stats Images */}
            <div className="space-y-4 mb-6">
                <div>
                    <Image
                        src="/images/stats2.jpg"
                        alt="Statistics Chart 2"
                        width={600}
                        height={400}
                        className="w-full rounded-lg shadow-lg mt-0"
                    />
                </div>
                <div>
                    <Image
                        src="/images/stats1.jpg"
                        alt="Statistics Chart 1"
                        width={600}
                        height={400}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
            </div>

            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 mt-0">Tested with Pay-as-You-Go Models</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    We've extensively tested our compression algorithms with leading pay-as-you-go AI services:
                </p>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://ai.bitcoin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-medium rounded-full hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                    >
                        ai.bitcoin.com
                    </a>
                    <a
                        href="https://openrouter.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-medium rounded-full hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                    >
                        OpenRouter API
                    </a>
                </div>
            </div>

            <p>
                These statistics reflect our commitment to providing reliable, efficient, and cost-effective
                AI compression solutions to our growing community.
            </p>
        </>
    )
}

// Meme Modal Content
export function MemeModalContent() {
    return (
        <>
            <div className="w-full h-full">
                <Image
                    src="/images/meme.avif"
                    alt="Compression Achievement Meme"
                    fill
                    className="object-cover"
                />
            </div>
        </>
    )
}

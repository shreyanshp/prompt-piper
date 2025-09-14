'use client'

import Image from 'next/image'

// Principal Modal Content
export function PrincipalModalContent() {
    return (
        <>
            <div className="mb-3">
                <div className="mb-3 mt-0">
                    <Image
                        style={{ marginTop: "-30px" }}
                        src="/images/mizakaru.jpg"
                        alt="Three Wise Monkeys - Mizaru, Kikazaru, Iwazaru (See no Evil, Hear no Evil, Speak no Evil), c. 1910"
                        width={600}
                        height={400}
                        className="w-full rounded-lg shadow-lg"
                    />
                    <p style={{ marginTop: "-20px" }} className="text-xs text-gray-500 dark:text-gray-400 mt-0 text-center">
                        Mizaru, Kikazaru, Iwazaru, (Shizaru) c. 1910<br/>
                        <a
                            href="https://www.oldtokyo.com/mizaru-kikizaru-iwazaru-c-1910/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                            Source: Old Tokyo
                        </a>
                    </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3" style={{ marginTop: "0px" }}>Philosophical Foundation</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Inspired by the ancient Japanese wisdom of the Three Wise Monkeys: <strong>Mizaru</strong> (See no Evil),
                        <strong> Kikazaru</strong> (Hear no Evil), and <strong>Iwazaru</strong> (Speak no Evil), we draw from
                        the traditional fourth principle: <strong>Shizaru</strong> - originally interpreted as "Do no Evil" -
                        which we adapt for the digital age as <em>Prompt No Evil</em>.
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        In today's AI landscape, the "evil" manifests as black box providers charging exorbitant fees for
                        prompts while giving users little control over input/output tokens. These systems capture our data,
                        manipulate our choices, and enclose our intelligence within corporate walls.
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Prompt Piper embodies <em>Prompt No Evil</em> by making AI interactions cheaper, more controllable,
                        and transparent - giving users the power to reduce costs while maintaining quality and privacy.
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Core Principles</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">Liberation over Manipulation</h5>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            AI as a power tool to empower individuals, not control them.
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Consent over Capture</h5>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            Your data and prompts remain private by default, processed locally.
                        </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Commons over Enclosure</h5>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                            Open, verifiable, and forkable infrastructure on IPFS.
                        </p>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Local-First</h5>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            Leveraging Ethereum's decentralized system for user-owned intelligence.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-3">Our Mission</h4>
                <p className="mb-4">
                    Prompt Piper challenges existing paradigms and returns to core values. We're building a
                    local-first, verifiable, and community-driven pre-processor that slashes token costs, preserves
                    privacy, and expands your effective context window.
                </p>
                <p className="mb-4">
                    <strong>The Problem:</strong> Black box AI providers charge exorbitant fees while giving users
                    little control over input/output tokens. <strong>The Solution:</strong> With the same model and
                    budget, you can fit more facts, more tools, more history without sending raw prompts to the cloud.
                    It's not just cheaper; it's user-owned intelligence infrastructure that puts you in control.
                </p>
                <p>
                    We believe in making AI easier to coordinate, private by default, and built on the
                    programmability of Ethereum's decentralized system. This is our modern embodiment of
                    <em> Shizaru</em> - giving every user the power to engage with AI consciously, ethically,
                    affordably, and on their own terms.
                </p>
            </div>
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

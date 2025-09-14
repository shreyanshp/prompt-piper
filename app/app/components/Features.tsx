'use client'

import Image from 'next/image'

const features = [
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3zm0 2h10v2H3V3zm0 4h10v6H3V7zm2 2a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5z"/>
            </svg>
        ),
        title: 'Smart Compression',
        description: 'Reduce AI prompt sizes by up to 60% while preserving semantic meaning using state-of-the-art compression algorithms optimized for LLM contexts.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 2a6 6 0 0 1 5.2 3H10a3 3 0 0 0-2-.8A3 3 0 0 0 6 5H2.8A6 6 0 0 1 8 2zM2 8a6 6 0 0 0 .8 3H6a3 3 0 0 0 2 .8 3 3 0 0 0 2-.8h3.2A6 6 0 0 0 14 8a6 6 0 0 0-.8-3H10a3 3 0 0 0-2-.8A3 3 0 0 0 6 5H2.8A6 6 0 0 0 2 8z"/>
            </svg>
        ),
        title: 'IPFS Integration',
        description: 'Decentralized storage of compression models on IPFS ensures availability, versioning, and censorship resistance for your compression pipelines.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M2.248 6.285a1 1 0 0 1-1.916-.57A8.014 8.014 0 0 1 5.715.332a1 1 0 0 1 .57 1.916 6.014 6.014 0 0 0-4.037 4.037Z" opacity=".3" />
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1.715-6.752a1 1 0 0 1 .57-1.916 8.014 8.014 0 0 1 5.383 5.383 1 1 0 1 1-1.916.57 6.014 6.014 0 0 0-4.037-4.037Zm4.037 7.467a1 1 0 1 1 1.916.57 8.014 8.014 0 0 1-5.383 5.383 1 1 0 1 1-.57-1.916 6.014 6.014 0 0 0 4.037-4.037Zm-7.467 4.037a1 1 0 1 1-.57 1.916 8.014 8.014 0 0 1-5.383-5.383 1 1 0 1 1 1.916-.57 6.014 6.014 0 0 0 4.037 4.037Z" />
            </svg>
        ),
        title: 'Token Optimization',
        description: 'Intelligent token analysis and optimization reduces API costs by minimizing token usage while maintaining prompt effectiveness and clarity.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M1 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4zm6 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4zm7-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h0z"/>
            </svg>
        ),
        title: 'Stream Processing',
        description: 'Real-time stream processing with Unix pipe compatibility allows seamless integration into existing workflows and CI/CD pipelines.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M10.284.33a1 1 0 1 0-.574 1.917 6.049 6.049 0 0 1 2.417 1.395A1 1 0 0 0 13.5 2.188 8.034 8.034 0 0 0 10.284.33ZM6.288 2.248A1 1 0 0 0 5.718.33 8.036 8.036 0 0 0 2.5 2.187a1 1 0 0 0 1.372 1.455 6.036 6.036 0 0 1 2.415-1.395ZM1.42 5.401a1 1 0 0 1 .742 1.204 6.025 6.025 0 0 0 0 2.79 1 1 0 0 1-1.946.462 8.026 8.026 0 0 1 0-3.714A1 1 0 0 1 1.421 5.4Zm2.452 6.957A1 1 0 0 0 2.5 13.812a8.036 8.036 0 0 0 3.216 1.857 1 1 0 0 0 .574-1.916 6.044 6.044 0 0 1-2.417-1.395Zm9.668.04a1 1 0 0 1-.041 1.414 8.033 8.033 0 0 1-3.217 1.857 1 1 0 1 1-.571-1.917 6.035 6.035 0 0 0 2.415-1.395 1 1 0 0 1 1.414.042Zm2.242-6.255a1 1 0 1 0-1.946.462 6.03 6.03 0 0 1 0 2.79 1 1 0 1 0 1.946.462 8.022 8.022 0 0 0 0-3.714Z" />
            </svg>
        ),
        title: 'Multi-Model Support',
        description: 'Compatible with GPT-4, Claude, Gemini, and other major LLMs with model-specific optimization strategies for maximum efficiency.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M9 1a1 1 0 1 0-2 0v6a1 1 0 0 0 2 0V1ZM4.572 3.08a1 1 0 0 0-1.144-1.64A7.987 7.987 0 0 0 0 8a8 8 0 0 0 16 0c0-2.72-1.36-5.117-3.428-6.56a1 1 0 1 0-1.144 1.64A5.987 5.987 0 0 1 14 8 6 6 0 1 1 2 8a5.987 5.987 0 0 1 2.572-4.92Z" />
            </svg>
        ),
        title: 'Docker Ready',
        description: 'Fully containerized with Docker support for consistent deployment across environments and easy integration with Kubernetes orchestration.'
    }
]

export default function Features() {
    return (
        <section className="relative before:absolute before:inset-0 before:bg-gray-900 before:-z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-16 md:pb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-200 font-title">
                            Compression Models: Powered by IPFS
                        </h2>
                    </div>

                    {/* Planet */}
                    <div className="pb-16 md:pb-20">
                        <div className="text-center">
                            <div className="inline-flex relative rounded-full before:absolute before:inset-0 before:-z-10 before:scale-[.85] before:bg-linear-to-b before:from-blue-900 before:to-sky-700/50 before:blur-3xl before:animate-pulse-slow after:absolute after:inset-0 after:rounded-[inherit] after:[background:radial-gradient(closest-side,var(--color-blue-500),transparent)]">
                                <Image
                                    className="bg-gray-900 rounded-full"
                                    src="/images/planet.png"
                                    width={400}
                                    height={400}
                                    alt="Planet"
                                />
                                <div className="pointer-events-none" aria-hidden="true">
                                    <Image
                                        className="absolute z-10 -top-20 -right-64 max-w-none"
                                        src="/images/planet-overlay.svg"
                                        width={789}
                                        height={755}
                                        alt="Planet decoration"
                                    />
                                    <div>
                                        <Image
                                            className="absolute z-10 top-16 -left-28 opacity-80 transition-opacity duration-500 animate-float"
                                            src="/images/planet-tag-01.png"
                                            width={253}
                                            height={56}
                                            alt="Tag 01"
                                        />
                                        <Image
                                            className="absolute z-10 top-7 left-56 opacity-30 transition-opacity duration-500 animate-float animation-delay-1s"
                                            src="/images/planet-tag-02.png"
                                            width={241}
                                            height={56}
                                            alt="Tag 02"
                                        />
                                        <Image
                                            className="absolute z-10 bottom-24 -left-20 opacity-25 transition-opacity duration-500 animate-float animation-delay-2s"
                                            src="/images/planet-tag-03.png"
                                            width={243}
                                            height={56}
                                            alt="Tag 03"
                                        />
                                        <Image
                                            className="absolute z-10 bottom-32 left-64 opacity-80 transition-opacity duration-500 animate-float animation-delay-3s"
                                            src="/images/planet-tag-04.png"
                                            width={251}
                                            height={56}
                                            alt="Tag 04"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 overflow-hidden *:p-6 md:*:p-10 *:relative *:before:absolute *:before:bg-gray-800 *:before:[block-size:100vh] *:before:[inline-size:1px] *:before:[inset-inline-start:-1px] *:before:[inset-block-start:0] *:after:absolute *:after:bg-gray-800 *:after:[block-size:1px] *:after:[inline-size:100vw] *:after:[inset-inline-start:0] *:after:[inset-block-start:-1px]">
                        {features.map((feature, index) => (
                            <article key={index}>
                                <h3 className="font-medium text-gray-200 flex items-center space-x-2 mb-2 font-title">
                                    {feature.icon}
                                    <span>{feature.title}</span>
                                </h3>
                                <p className="text-[15px] text-gray-400">
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
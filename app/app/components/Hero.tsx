'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative">
            {/* Stripes illustration */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 pointer-events-none -z-10" aria-hidden="true">
                <Image
                    className="max-w-none"
                    src="/images/stripes.svg"
                    width={768}
                    height={432}
                    alt="Stripes"
                />
            </div>

            {/* Background circles */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-32 ml-[580px] pointer-events-none" aria-hidden="true">
                <div className="w-80 h-80 rounded-full bg-linear-to-tr from-blue-500 opacity-50 blur-[160px] will-change-[filter]"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[420px] ml-[380px] pointer-events-none" aria-hidden="true">
                <div className="w-80 h-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-50 blur-[160px] will-change-[filter]"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[640px] -ml-[300px] pointer-events-none" aria-hidden="true">
                <div className="w-80 h-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-50 blur-[160px] will-change-[filter]"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Hero content */}
                <div className="pt-32 pb-0 md:pt-40 md:pb-0">
                    {/* Section header */}
                    <div className="text-center pb-12 md:pb-16">
                        <h1
                            className="text-5xl md:text-6xl font-bold mb-6 border-y [border-image:linear-gradient(to_right,transparent,var(--color-slate-300/.8),transparent)1] animate-zoom-y-out animation-delay-150ms font-title"
                        >
                            Prompt Compression
                        </h1>
                        <div className="max-w-3xl mx-auto">
                            <p
                                className="text-lg text-gray-700 dark:text-white mb-8 animate-zoom-y-out animation-delay-300ms"
                            >
                                Prompt Compression for LLMs, Reduce Token Usage, Save Costs, Build Faster
                            </p>
                            <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,var(--color-slate-300/.8),transparent)1]">
                                <div
                                    className="relative max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center animate-zoom-y-out animation-delay-450ms"
                                >
                                    <Link
                                        className="btn text-white bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] hover:bg-[length:100%_150%] bg-[bottom] shadow-sm w-full mb-4 sm:w-auto sm:mb-0 group"
                                        href="/demo"
                                    >
                                        <span className="relative inline-flex items-center">
                                            Try Demo
                                        </span>
                                    </Link>
                                    <Link
                                        className="btn text-gray-800 bg-white hover:bg-gray-50 shadow-sm w-full sm:w-auto sm:ml-4"
                                        href="https://www.npmjs.com/package/prompt-piper-cli"
                                    >
                                        Download CLI
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero terminal image */}
                    <div
                        className="max-w-3xl mx-auto animate-zoom-y-out animation-delay-600ms"
                    >
                        <div className="relative aspect-video bg-gray-900 rounded-2xl px-5 py-3 shadow-xl ">
                            <div className="relative flex items-center justify-between before:block before:w-[41px] before:h-[9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,var(--color-gray-600)_4.5px,transparent_0)] before:bg-[length:16px_9px] after:w-[41px] mb-8">
                                <span className="text-white font-medium text-[13px]">prompt-piper</span>
                            </div>
                            <div className="text-gray-500 text-sm font-mono [&_span]:opacity-0">
                                <span className="text-gray-200 animate-[code-1_10s_infinite]">$ cat large_context.txt</span>{' '}
                                <span className="animate-[code-2_10s_infinite]">| prompt-piper compress --model claude-3</span><br />
                                <span className="animate-[code-3_10s_infinite]">✓ Loading IPFS model: QmX7k9...</span><br />
                                <span className="animate-[code-4_10s_infinite]">✓ Tokenizing input: 12,847 tokens detected</span><br />
                                <span className="animate-[code-5_10s_infinite]">✓ Applying semantic compression...</span><br />
                                <span className="text-green-400 animate-[code-6_10s_infinite]">✓ Output: 4,931 tokens (62% reduction)</span><br /><br />
                                <span className="text-gray-200 animate-[code-7_10s_infinite]">$ prompt-piper analyze</span>{' '}
                                <span className="animate-[code-8_10s_infinite]">--cost-estimate</span><br />
                                <span className="animate-[code-9_10s_infinite]">📊 Compression Stats:</span><br />
                                <span className="animate-[code-10_10s_infinite]">   • Original cost: $0.385 | Compressed: $0.148</span><br />
                                <span className="text-blue-400 animate-[code-11_10s_infinite]">   • Monthly savings (1000 calls): $237.00</span><br />
                                <span className="animate-[code-12_10s_infinite]">   • Context window usage: 38% → 15%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

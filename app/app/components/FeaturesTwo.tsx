'use client'

import Image from 'next/image'

const features = [
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="m15.447 6.605-.673-.336a6.973 6.973 0 0 0-.761-1.834l.238-.715a.999.999 0 0 0-.242-1.023l-.707-.707a.995.995 0 0 0-1.023-.242l-.715.238a6.96 6.96 0 0 0-1.834-.761L9.394.552A1 1 0 0 0 8.5-.001h-1c-.379 0-.725.214-.895.553l-.336.673a6.973 6.973 0 0 0-1.834.761l-.715-.238a.997.997 0 0 0-1.023.242l-.707.707a1.001 1.001 0 0 0-.242 1.023l.238.715a6.959 6.959 0 0 0-.761 1.834l-.673.336a1 1 0 0 0-.553.895v1c0 .379.214.725.553.895l.673.336c.167.653.425 1.268.761 1.834l-.238.715a.999.999 0 0 0 .242 1.023l.707.707a.997.997 0 0 0 1.023.242l.715-.238a6.959 6.959 0 0 0 1.834.761l.336.673a1 1 0 0 0 .895.553h1c.379 0 .725-.214.895-.553l.336-.673a6.973 6.973 0 0 0 1.834-.761l.715.238a1.001 1.001 0 0 0 1.023-.242l.707-.707c.268-.268.361-.664.242-1.023l-.238-.715a6.959 6.959 0 0 0 .761-1.834l.673-.336A1 1 0 0 0 16 8.5v-1c0-.379-.214-.725-.553-.895ZM8 13a5 5 0 1 1 .001-10.001 5 5 0 0 1 0 10.001Z" />
            </svg>
        ),
        title: 'Optimization',
        description: 'Collect essential insights about how visitors are using your site with in-depth page view metrics like pages, referring sites, and more.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="12">
                <path d="M2 0a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H2Zm0 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm1-3a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H3Z" />
            </svg>
        ),
        title: 'Cookie Banner',
        description: 'Collect essential insights about how visitors are using your site with in-depth page view metrics like pages, referring sites, and more.'
    },
    {
        icon: (
            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M14.75 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm0 13.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM2.5 14.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM1.25 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2Z" />
            </svg>
        ),
        title: 'Custom Domain',
        description: 'Collect essential insights about how visitors are using your site with in-depth page view metrics like pages, referring sites, and more.'
    }
]

export default function FeaturesTwo() {
    return (
        <section className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" aria-hidden="true">
                <div className="w-80 h-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-40 blur-[160px] will-change-[filter]"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-24 md:pb-28">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-title">
                            Expand Context Window
                        </h2>
                        <p className="text-lg text-gray-700">
                            Use powerful yet familiar tools to create your ultimate website design. Import your files everywhere, including Figma.
                        </p>
                    </div>

                    {/* Terminal Illustration */}
                    <div className="group relative w-full max-w-[500px] mx-auto flex justify-center mb-32 md:mb-36">
                        <div className="absolute bottom-0 -z-10" aria-hidden="true">
                            <div className="w-80 h-80 rounded-full bg-blue-500 opacity-70 blur-[160px] will-change-[filter]"></div>
                        </div>

                        <div className="w-full aspect-video bg-gray-900 rounded-2xl px-5 py-3 shadow-xl -rotate-1 group-hover:-rotate-0 transition duration-300">
                            <div className="relative flex items-center justify-between before:block before:w-[41px] before:h-[9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,var(--color-gray-600)_4.5px,transparent_0)] before:bg-[length:16px_9px] after:w-[41px] mb-8">
                                <span className="text-white font-medium text-[13px]">Prompt Piper</span>
                            </div>
                            <div className="text-gray-500 font-mono [&_span]:opacity-0 text-sm blur-xs will-change-[filter] group-hover:blur-none transition duration-300">
                                <span className="text-gray-200 animate-[code-1_10s_infinite]">npm login</span>{' '}
                                <span className="animate-[code-2_10s_infinite]">--registry=https://npm.pkg.github.com</span><br />
                                <span className="animate-[code-3_10s_infinite]">--scope=@phanatic</span>{' '}
                                <span className="animate-[code-4_10s_infinite]">Successfully logged-in.</span><br /><br />
                                <span className="text-gray-200 animate-[code-5_10s_infinite]">npm publish</span><br />
                                <span className="animate-[code-6_10s_infinite]">Package published.</span>
                            </div>
                        </div>

                        <div className="absolute top-16">
                            <div className="translate-y-2 group-hover:opacity-0 group-hover:translate-y-0 transition duration-300 pointer-events-none mb-[7%]">
                                <Image className="-rotate-2" src="/images/features-02-overlay-01.png" width={500} height={72} alt="Overlay 01" />
                            </div>
                            <div className="translate-y-2 group-hover:opacity-0 group-hover:translate-y-0 transition duration-300 delay-50 pointer-events-none mb-[3.5%]">
                                <Image src="/images/features-02-overlay-02.png" width={500} height={40} alt="Overlay 02" />
                            </div>
                            <div className="translate-y-2 group-hover:opacity-0 group-hover:translate-y-0 transition duration-300 delay-100 pointer-events-none">
                                <Image className="-rotate-1" src="/images/features-02-overlay-03.png" width={500} height={91} alt="Overlay 03" />
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid lg:grid-cols-3 overflow-hidden border-y [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1] *:p-6 md:*:px-10 md:*:py-12 *:relative *:before:absolute *:before:bg-linear-to-b *:before:from-transparent *:before:via-gray-200 *:before:[block-size:100%] *:before:[inline-size:1px] *:before:[inset-inline-start:-1px] *:before:[inset-block-start:0]">
                        {features.map((feature, index) => (
                            <article key={index}>
                                <h3 className="font-medium flex items-center space-x-2 mb-2 font-title">
                                    {feature.icon}
                                    <span>{feature.title}</span>
                                </h3>
                                <p className="text-[15px] text-gray-700">
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

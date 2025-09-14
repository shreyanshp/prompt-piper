'use client'

import { useState } from 'react'
import Image from 'next/image'

const logoSets = [
    {
        id: 1,
        logos: [
            { src: '/images/openai.svg', size: { width: 23, height: 22 }, position: 'absolute -translate-x-[136px]' },
            { src: '/images/claude.png', size: { width: 22, height: 22 }, position: 'absolute translate-x-[136px]' },
            { src: '/images/gemini.svg', size: { width: 24, height: 22 }, position: 'absolute -translate-x-[216px] -translate-y-[82px]' },
            { src: '/images/grok.svg', size: { width: 25, height: 25 }, position: 'absolute translate-x-[216px] -translate-y-[82px]' },
            { src: '/images/logo-06.svg', size: { width: 20, height: 18 }, position: 'absolute translate-x-[216px] translate-y-[82px]' },
            { src: '/images/logo-07.svg', size: { width: 25, height: 25 }, position: 'absolute -translate-x-[216px] translate-y-[82px]' },
            { src: '/images/logo-08.svg', size: { width: 20, height: 20 }, position: 'absolute -translate-x-[292px] opacity-40' },
            { src: '/images/logo-09.svg', size: { width: 21, height: 13 }, position: 'absolute translate-x-[292px] opacity-40' }
        ]
    },
    // Add more logo sets for different tabs if needed
]

export default function LogoShowcase() {
    const [activeTab, setActiveTab] = useState(1)

    return (
        <section>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div>
                    {/* Tabs component */}
                    <div className="relative flex items-center justify-center h-[324px]">
                        {/* Background decorations */}
                        <div className="absolute -z-10">
                            <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="164" height="41" viewBox="0 0 164 41" fill="none">
                                <circle cx="1" cy="8" r="1" fillOpacity="0.24" />
                                <circle cx="1" cy="1" r="1" fillOpacity="0.16" />
                                <circle cx="1" cy="15" r="1" />
                                <circle cx="1" cy="26" r="1" fillOpacity="0.64" />
                                <circle cx="1" cy="33" r="1" fillOpacity="0.24" />
                                <circle cx="8" cy="8" r="1" />
                                <circle cx="8" cy="15" r="1" />
                                <circle cx="8" cy="26" r="1" fillOpacity="0.24" />
                                <circle cx="15" cy="15" r="1" fillOpacity="0.64" />
                                <circle cx="15" cy="26" r="1" fillOpacity="0.16" />
                                <circle cx="8" cy="33" r="1" />
                                <circle cx="1" cy="40" r="1" />
                                {/* Mirror pattern on right */}
                                <circle cx="163" cy="8" r="1" fillOpacity="0.24" />
                                <circle cx="163" cy="1" r="1" fillOpacity="0.16" />
                                <circle cx="163" cy="15" r="1" />
                                <circle cx="163" cy="26" r="1" fillOpacity="0.64" />
                                <circle cx="163" cy="33" r="1" fillOpacity="0.24" />
                                <circle cx="156" cy="8" r="1" />
                                <circle cx="156" cy="15" r="1" />
                                <circle cx="156" cy="26" r="1" fillOpacity="0.24" />
                                <circle cx="149" cy="15" r="1" fillOpacity="0.64" />
                                <circle cx="149" cy="26" r="1" fillOpacity="0.16" />
                                <circle cx="156" cy="33" r="1" />
                                <circle cx="163" cy="40" r="1" />
                            </svg>
                        </div>

                        {/* Blue glow */}
                        <div className="absolute -z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="432" height="160" viewBox="0 0 432 160" fill="none">
                                <g opacity="0.6" filter="url(#filter0_f_2044_9)">
                                    <path className="fill-blue-500" fillRule="evenodd" clipRule="evenodd" d="M80 112C62.3269 112 48 97.6731 48 80C48 62.3269 62.3269 48 80 48C97.6731 48 171 62.3269 171 80C171 97.6731 97.6731 112 80 112ZM352 112C369.673 112 384 97.6731 384 80C384 62.3269 369.673 48 352 48C334.327 48 261 62.3269 261 80C261 97.6731 334.327 112 352 112Z" />
                                </g>
                                <defs>
                                    <filter id="filter0_f_2044_9" x="0" y="0" width="432" height="160" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                        <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur_2044_9" />
                                    </filter>
                                </defs>
                            </svg>
                        </div>

                        {/* Horizontal lines */}
                        <div className="absolute -z-10 inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-x-[200px] top-1/2 h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent -translate-y-[82px] before:absolute before:inset-y-0 before:w-24 before:bg-linear-to-r before:via-blue-500 before:animate-line mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent translate-y-[82px] before:absolute before:inset-y-0 before:w-24 before:bg-linear-to-r before:via-blue-500 before:animate-line before:animation-delay-5s mix-blend-multiply"></div>

                        {/* Diagonal lines */}
                        <div className="absolute -z-10 inset-x-[300px] top-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent rotate-[20deg] mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-x-[300px] top-1/2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent -rotate-[20deg] mix-blend-multiply"></div>

                        {/* Vertical lines */}
                        <div className="absolute -z-10 inset-y-0 left-1/2 w-px bg-linear-to-b from-gray-200 to-transparent -translate-x-[216px] mix-blend-multiply"></div>
                        <div className="absolute -z-10 inset-y-0 left-1/2 w-px bg-linear-to-t from-gray-200 to-transparent translate-x-[216px] mix-blend-multiply"></div>

                        {/* Center logo with spinning border */}
                        <div className="absolute before:absolute before:-inset-3 before:rounded-full before:[background:conic-gradient(from_180deg,transparent,var(--color-blue-500))_border-box] before:border before:border-transparent before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[mask-composite:exclude_!important] before:animate-spin before:duration-[3s]">
                            <div className="animate-breath">
                                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:bg-gray-200/60 before:border before:border-gray-700/5 before:rounded-[inherit] before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                                    <Image className="relative" src="/images/logo-01.svg" width={32} height={32} alt="Logo 01" />
                                </div>
                            </div>
                        </div>

                        {/* Logo panels */}
                        {logoSets.map((set) => (
                            <div
                                key={set.id}
                                className={`w-full h-full flex items-center justify-center transition-all duration-700 ${activeTab === set.id
                                        ? 'opacity-100 scale-100'
                                        : 'absolute opacity-0 scale-90'
                                    }`}
                                role="tabpanel"
                                tabIndex={0}
                                aria-labelledby={`tab-${set.id}`}
                            >
                                {set.logos.map((logo, index) => (
                                    <div key={index} className={logo.position}>
                                        <div
                                            className={`animate-breath`}
                                            style={{ animationDelay: `${(index + 1) * 0.5}s` }}
                                        >
                                            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:bg-gray-200/60 before:border before:border-gray-700/5 before:rounded-[inherit] before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                                                <Image
                                                    className="relative"
                                                    src={logo.src}
                                                    width={logo.size.width}
                                                    height={logo.size.height}
                                                    alt={`Logo ${index + 1}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

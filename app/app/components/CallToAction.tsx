'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CallToAction() {
    return (
        <section>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="rounded-2xl text-center relative overflow-hidden shadow-xl before:absolute before:inset-0 before:rounded-2xl before:bg-gray-900 before:pointer-events-none before:-z-10">
                    {/* Glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 -z-10" aria-hidden="true">
                        <div className="w-[480px] h-56 rounded-full border-[20px] border-blue-500 blur-3xl will-change-[filter]"></div>
                    </div>

                    {/* Stripes illustration */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 pointer-events-none -z-10" aria-hidden="true">
                        <Image
                            className="max-w-none"
                            src="/images/stripes-dark.svg"
                            width={768}
                            height={432}
                            alt="Stripes"
                        />
                    </div>

                    <div className="py-12 md:py-20 px-4 md:px-12">
                        <h2 className="text-3xl md:text-4xl text-gray-200 font-bold mb-6 md:mb-12 border-y [border-image:linear-gradient(to_right,transparent,var(--color-slate-700/.7),transparent)1] font-title">
                            Start Saving with Prompt Piper
                        </h2>

                        <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
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
                                href="/cli"
                            >
                                Download CLI
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

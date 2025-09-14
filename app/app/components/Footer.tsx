'use client'

import Link from 'next/link'
import Image from 'next/image'

const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/demo', label: 'Demo' },
    { href: '/pricing', label: 'Principal' },
    { href: '/about', label: 'Team' },
    { href: '/stats', label: 'Stats' },
];

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Footer content */}
                <div className="py-8 md:py-12">
                    {/* Logo, copyright, and navigation in one row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Logo and copyright */}
                        <div className="flex items-center gap-[10px]">
                            {/* Logo */}
                            <Link className="inline-flex" href="/" aria-label="Prompt Piper">
                                <Image src="/images/logo.svg" width={28} height={28} alt="Prompt Piper Logo" />
                            </Link>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                &copy; promptpiper.xyz - All rights reserved.
                            </div>
                        </div>

                        {/* Main navigation links */}
                        <div className="flex flex-wrap gap-6">
                            {mainLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    className="text-sm font-bold text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 transition"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

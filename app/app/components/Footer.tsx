'use client'

import Link from 'next/link'
import Image from 'next/image'

const companyLinks = [
    { href: '/about', label: 'About us' },
];

const resourceLinks = [
    { href: '/community', label: 'Community' },
    { href: '/terms', label: 'Terms of service' },
    { href: '/vulnerability', label: 'Report a vulnerability' }
];

export default function Footer() {
    return (
        <footer>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Top area: Blocks */}
                <div className="grid sm:grid-cols-12 gap-10 py-8 md:py-12">
                    {/* 1st block */}
                    <div className="sm:col-span-12 lg:col-span-4 space-y-2">
                        <div>
                            {/* Logo */}
                            <Link className="inline-flex" href="/" aria-label="Prompt Piper">
                                <Image src="/images/logo.svg" width={28} height={28} alt="Prompt Piper Logo" />
                            </Link>
                        </div>
                        <div className="text-sm text-gray-600">
                            &copy; promptpiper.xyz - All rights reserved.
                        </div>
                    </div>

                    {/* 3rd block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 space-y-2">
                        <h3 className="text-sm font-medium font-title">Company</h3>
                        <ul className="text-sm space-y-2">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        className="text-gray-600 hover:text-gray-900 transition"
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

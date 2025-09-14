'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <header className="fixed top-2 md:top-6 w-full z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="relative flex items-center justify-between gap-3 h-14 rounded-2xl px-3 backdrop-blur-xs bg-white/90 shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[mask-composite:exclude_!important] before:pointer-events-none">

                    {/* Site branding */}
                    <div className="flex-1 flex items-center">
                        <Link className="inline-flex items-center gap-2" href="/" aria-label="Prompt Piper">
                            <Image src="/images/logo.svg" width={28} height={28} alt="Prompt Piper Logo" />
                            <span className="text-xl font-semibold text-gray-900 font-title">Prompt Piper</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:grow">
                        <ul className="text-sm flex grow justify-center flex-wrap items-center gap-4 lg:gap-8">
                        <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/pricing">
                                    Home
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/demo">
                                    Demo
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/demo-2">
                                    Demo 2
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/demo-3">
                                    Demo 3
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/pricing">
                                    Principal
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 flex items-center transition" href="/documentation">
                                    Docs
                                </Link>
                            </li>

                            {/* Dropdown menu */}
                            <li
                                className="relative flex items-center gap-0.5 px-3 py-1"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <span className="text-gray-700 hover:text-gray-900 flex items-center cursor-pointer transition">
                                    Extra
                                </span>
                                <button
                                    className="shrink-0 p-1"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className="sr-only">Show submenu for "Extra"</span>
                                    <svg className="fill-gray-400" xmlns="http://www.w3.org/2000/svg" width="10" height="6">
                                        <path d="m1.06.19 3.5 3.5 3.5-3.5 1.061 1.06-4.56 4.56L0 1.25 1.06.19Z" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {dropdownOpen && (
                                    <ul className="origin-top-left absolute top-full left-0 w-36 bg-white p-2 rounded-xl shadow-lg shadow-black/[0.03] border border-gray-100">
                                        <li>
                                            <Link className="text-sm text-gray-700 hover:bg-gray-100 flex py-1.5 px-2 rounded-lg" href="/support">
                                                Support center
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="text-sm text-gray-700 hover:bg-gray-100 flex py-1.5 px-2 rounded-lg" href="/apps">
                                                Apps
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>

                    {/* Desktop sign in links */}
                    <ul className="flex-1 flex justify-end items-center gap-3">
                        <li>
                            <Link className="btn-sm text-gray-200 bg-gray-800 hover:bg-gray-900 shadow-sm" href="/signup">
                                GitHub
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile menu */}
                    <div className="flex md:hidden">
                        <button
                            className="group inline-flex w-8 h-8 text-gray-800 bg-white text-center items-center justify-center transition"
                            aria-controls="mobile-nav"
                            aria-expanded={mobileNavOpen}
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        >
                            <span className="sr-only">Menu</span>
                            <svg className="w-4 h-4 fill-current pointer-events-none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${mobileNavOpen
                                            ? 'rotate-[315deg] translate-y-0 translate-x-0'
                                            : '-translate-y-[5px] translate-x-[7px]'
                                        }`}
                                    y="7"
                                    width="9"
                                    height="2"
                                    rx="1"
                                />
                                <rect
                                    className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] ${mobileNavOpen ? 'rotate-45' : ''
                                        }`}
                                    y="7"
                                    width="16"
                                    height="2"
                                    rx="1"
                                />
                                <rect
                                    className={`origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] ${mobileNavOpen
                                            ? 'rotate-[135deg] translate-y-0'
                                            : 'translate-y-[5px]'
                                        }`}
                                    y="7"
                                    width="9"
                                    height="2"
                                    rx="1"
                                />
                            </svg>
                        </button>

                        {/* Mobile navigation */}
                        {mobileNavOpen && (
                            <nav
                                id="mobile-nav"
                                className="absolute top-full z-20 left-0 w-full bg-white rounded-xl shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[mask-composite:exclude_!important] before:pointer-events-none"
                            >
                                <ul className="text-sm p-2">
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/demo">
                                            Demo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/demo-2">
                                            Demo 2
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/demo-3">
                                            Demo 3
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/pricing">
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/customers">
                                            Customers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/documentation">
                                            Docs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/support">
                                            Support center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 rounded-lg py-1.5 px-2" href="/apps">
                                            Apps
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

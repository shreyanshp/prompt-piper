'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import Modal from './Modal'

export default function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [modalOpen, setModalOpen] = useState<'principal' | 'team' | 'stats' | null>(null)

    // Initialize dark mode from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setIsDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode
        setIsDarkMode(newDarkMode)

        if (newDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const openModal = (modal: 'principal' | 'team' | 'stats') => {
        setModalOpen(modal)
        setMobileNavOpen(false) // Close mobile nav when opening modal
    }

    const closeModal = () => {
        setModalOpen(null)
    }

    return (
        <header className="fixed top-2 md:top-6 w-full z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="relative flex items-center justify-between gap-3 h-14 rounded-2xl px-3 backdrop-blur-xs bg-white/90 dark:bg-gray-900/90 shadow-lg shadow-black/[0.03] dark:shadow-white/[0.03] before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] dark:before:[background:linear-gradient(var(--color-gray-800),var(--color-gray-700))_border-box] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[mask-composite:exclude_!important] before:pointer-events-none">

                    {/* Site branding */}
                    <div className="flex-1 flex items-center">
                        <Link className="inline-flex items-center gap-2" href="/" aria-label="Prompt Piper">
                            <Image src="/images/logo.svg" width={28} height={28} alt="Prompt Piper Logo" />
                            <span className="text-xl font-semibold text-gray-900 dark:text-white font-title">Prompt Piper</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:grow">
                        <ul className="text-sm flex grow justify-center flex-wrap items-center gap-4 lg:gap-8">
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center transition font-semibold" href="/">
                                    Home
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <Link className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center transition font-semibold" href="/demo">
                                    Demo
                                </Link>
                            </li>
                            <li className="px-3 py-1">
                                <button
                                    onClick={() => openModal('principal')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center transition font-semibold"
                                >
                                    Principal
                                </button>
                            </li>
                            <li className="px-3 py-1">
                                <button
                                    onClick={() => openModal('team')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center transition font-semibold"
                                >
                                    Team
                                </button>
                            </li>
                            <li className="px-3 py-1">
                                <button
                                    onClick={() => openModal('stats')}
                                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center transition font-semibold"
                                >
                                    Stats
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Desktop sign in links */}
                    <ul className="flex-1 flex justify-end items-center gap-3">
                        <li>
                            <button
                                onClick={toggleDarkMode}
                                className="btn-sm text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm transition-colors"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        </li>
                        <li>
                            <Link className="btn-sm text-gray-200 bg-gray-800 hover:bg-gray-900 shadow-sm font-semibold flex items-center gap-2" href="https://github.com/vm06007/prompt-piper" target="_blank" rel="noopener noreferrer">
                                <Image src="/images/github.png" width={16} height={16} alt="GitHub" className="invert" />
                                GitHub
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile menu */}
                    <div className="flex md:hidden">
                        <button
                            className="group inline-flex w-8 h-8 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 text-center items-center justify-center transition"
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
                                className="absolute top-full z-20 left-0 w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-black/[0.03] dark:shadow-white/[0.03] before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] dark:before:[background:linear-gradient(var(--color-gray-800),var(--color-gray-700))_border-box] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[mask-composite:exclude_!important] before:pointer-events-none"
                            >
                                <ul className="text-sm p-2">
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg py-1.5 px-2 font-semibold" href="/">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="flex text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg py-1.5 px-2 font-semibold" href="/demo">
                                            Demo
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => openModal('principal')}
                                            className="flex text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg py-1.5 px-2 font-semibold w-full text-left"
                                        >
                                            Principal
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => openModal('team')}
                                            className="flex text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg py-1.5 px-2 font-semibold w-full text-left"
                                        >
                                            Team
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => openModal('stats')}
                                            className="flex text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg py-1.5 px-2 font-semibold w-full text-left"
                                        >
                                            Stats
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={modalOpen === 'principal'}
                onClose={closeModal}
                title="Principal"
                image="/images/principal.png"
                imageAlt="Principal"
            >
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
            </Modal>

            <Modal
                isOpen={modalOpen === 'team'}
                onClose={closeModal}
                title="Our Team"
                image="/images/team.png"
                imageAlt="Team"
            >
                <h3 className="text-xl font-semibold mb-4">Meet Our Team</h3>
                <p className="mb-4">
                    Our team consists of passionate developers, AI researchers, and blockchain experts who are
                    dedicated to solving the challenges of AI accessibility and cost optimization.
                </p>
                <p className="mb-4">
                    We combine expertise in machine learning, distributed systems, and user experience design
                    to create solutions that are both powerful and easy to use.
                </p>
                <p>
                    Our diverse background and shared vision drive us to continuously innovate and improve
                    the Prompt Piper platform for our growing community of users.
                </p>
            </Modal>

            <Modal
                isOpen={modalOpen === 'stats'}
                onClose={closeModal}
                title="Statistics"
                image="/images/stats.png"
                imageAlt="Statistics"
            >
                <h3 className="text-xl font-semibold mb-4">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">60%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Compression</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">$2.3M</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Costs Saved</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">10K+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">99.9%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                    </div>
                </div>
                <p>
                    These statistics reflect our commitment to providing reliable, efficient, and cost-effective
                    AI compression solutions to our growing community.
                </p>
            </Modal>
        </header>
    )
}

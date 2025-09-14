'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Modal from './Modal'

const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/demo', label: 'Demo' },
    { href: null, label: 'Principal', modal: 'principal' },
    { href: null, label: 'Team', modal: 'team' },
    { href: null, label: 'Stats', modal: 'stats' },
];

export default function Footer() {
    const [modalOpen, setModalOpen] = useState<'principal' | 'team' | 'stats' | null>(null)

    const openModal = (modal: 'principal' | 'team' | 'stats') => {
        setModalOpen(modal)
    }

    const closeModal = () => {
        setModalOpen(null)
    }

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
                                link.href ? (
                                    <Link
                                        key={index}
                                        className="text-sm font-bold text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 transition"
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <button
                                        key={index}
                                        onClick={() => openModal(link.modal as 'principal' | 'team' | 'stats')}
                                        className="text-sm font-bold text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300 transition"
                                    >
                                        {link.label}
                                    </button>
                                )
                            ))}
                        </div>
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
        </footer>
    )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Modal from './Modal'
import { PrincipalModalContent, TeamModalContent, StatsModalContent } from './ModalContent'

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
                <PrincipalModalContent />
            </Modal>

            <Modal
                isOpen={modalOpen === 'team'}
                onClose={closeModal}
                title="Hackathon Team"
            >
                <TeamModalContent />
            </Modal>

            <Modal
                isOpen={modalOpen === 'stats'}
                onClose={closeModal}
                title="Statistics"
                image="/images/stats.png"
                imageAlt="Statistics"
            >
                <StatsModalContent />
            </Modal>
        </footer>
    )
}

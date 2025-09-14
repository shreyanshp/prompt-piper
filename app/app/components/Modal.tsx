'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    image?: string
    imageAlt?: string
    children: React.ReactNode
    fullScreenImage?: boolean
}

export default function Modal({ isOpen, onClose, title, image, imageAlt, children, fullScreenImage = false }: ModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden ${
                fullScreenImage 
                    ? 'w-[90vw] h-[90vh]' 
                    : 'max-w-2xl w-full mx-4 max-h-[90vh]'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-title">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className={fullScreenImage ? "relative h-[calc(90vh-120px)]" : "p-6 overflow-y-auto max-h-[calc(90vh-120px)]"}>
                    {/* Image - only show if provided */}
                    {image && !fullScreenImage && (
                        <div className="mb-6 text-center">
                            <Image
                                src={image}
                                alt={imageAlt || 'Modal image'}
                                width={400}
                                height={300}
                                className="mx-auto rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Text content */}
                    {!fullScreenImage && (
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            {children}
                        </div>
                    )}

                    {/* Full screen image content */}
                    {fullScreenImage && (
                        <div className="w-full h-full">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap'
})

export const metadata: Metadata = {
    title: 'Prompt Piper - AI Prompt Compression',
    description: 'Compress AI prompts to reduce token usage, save costs, and build faster. Reduce your LLM costs with intelligent prompt compression.',
    keywords: 'AI, prompt compression, token reduction, cost savings, LLM optimization',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Saira:wght@700&display=swap" rel="stylesheet" />
            </head>
            <body className={`${inter.variable} font-inter antialiased bg-gray-50 text-gray-900 tracking-tight`}>
                <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
                    {children}
                </div>
            </body>
        </html>
    )
}
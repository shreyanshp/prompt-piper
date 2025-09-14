'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PromptComparison from './components/PromptComparison'

export default function Demo3Page() {
    return (
        <>
            <Header />
            <main className="grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 md:pt-40 md:pb-16">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-title">
                            Prompt Piper 🎵
                        </h1>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                            Advanced AI-powered prompt compression with real neural networks
                        </p>
                    </div>
                    <PromptComparison />
                </div>
            </main>
            <Footer />
        </>
    )
}

'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PromptComparison from './components/PromptComparison'

export default function Demo3Page() {
    return (
        <>
            <Header />
            <main className="grow">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-12 md:pt-40 md:pb-16">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-title">
                            Compression Demo
                        </h1>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            Try our prompt compression engine live. See how much you can reduce token usage and save costs and also expanding maximum context window.
                        </p>
                    </div>
                    <PromptComparison />
                </div>
            </main>
            <Footer />
        </>
    )
}

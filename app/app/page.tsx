'use client'

import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import LogoShowcase from './components/LogoShowcase'
import Features from './components/Features'
import FeaturesTwo from './components/FeaturesTwo'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'

export default function Home() {
    return (
        <>
            <Header />
            <main className="grow">
                <Hero />
                <LogoShowcase />
                <Features />
                <FeaturesTwo />
                <CallToAction />
            </main>
            <Footer />
        </>
    )
}
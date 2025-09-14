'use client';

import { useState, useEffect } from 'react';
import PromptComparison from './PromptComparison';

export default function PromptComparisonWrapper() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Prompt Piper...</p>
                </div>
            </div>
        );
    }

    return <PromptComparison />;
}

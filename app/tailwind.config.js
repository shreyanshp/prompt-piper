/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                blue: {
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
                sky: {
                    700: '#0369a1',
                },
                slate: {
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    700: '#334155',
                },
            },
            fontFamily: {
                inter: ['var(--font-inter)', 'sans-serif'],
                title: ['Saira', 'sans-serif'],
            },
            backgroundImage: {
                'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
                'linear-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
                'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
                'linear-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
            },
            animation: {
                'breath': 'breath 8s ease-in-out infinite both',
                'float': 'float 4s ease-in-out infinite both',
                'line': 'line 10s ease-in-out infinite both',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite both',
                'zoom-y-out': 'zoom-y-out 0.6s ease-out',
                'spin': 'spin 3s linear infinite',
            },
            keyframes: {
                'breath': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'line': {
                    '0%': { left: '0', opacity: '0' },
                    '25%': { opacity: '1' },
                    '75%': { opacity: '1' },
                    '100%': { left: '100%', opacity: '0' },
                },
                'zoom-y-out': {
                    'from': { opacity: '0', transform: 'scale3d(0.8, 0.8, 0.8)' },
                    'to': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
                },
                'code-1': {
                    '0%, 2.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
                'code-2': {
                    '0%, 5%': { opacity: '0' },
                    '5.1%, 7.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
                'code-3': {
                    '0%, 10%': { opacity: '0' },
                    '10.1%, 12.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
                'code-4': {
                    '0%, 15%': { opacity: '0' },
                    '15.1%, 17.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
                'code-5': {
                    '0%, 25%': { opacity: '0' },
                    '25.1%, 27.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
                'code-6': {
                    '0%, 30%': { opacity: '0' },
                    '30.1%, 32.5%': { opacity: '1' },
                    '97.5%, 100%': { opacity: '0' },
                },
            },
            blur: {
                'xs': '2px',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}

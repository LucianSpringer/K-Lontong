/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                // [LUMEN FIX] Use CSS Variables for Dynamic Theming
                'warung-orange': 'var(--warung-primary)',
                'warung-yellow': 'var(--warung-secondary)',
                'warung-teal': 'var(--warung-accent)',
                'warung-cream': 'var(--warung-bg-light)',
                'warung-brown': 'var(--warung-text-main)',
                'warung-deep-brown': 'var(--warung-heading)',
            },
            fontFamily: {
                heading: ['Archivo Black', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

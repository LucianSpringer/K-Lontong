/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'warung-orange': '#FF6B35',
                'warung-yellow': '#FFB800',
                'warung-teal': '#0D9488',
                'warung-cream': '#FFF8E7',
                'warung-brown': '#8B4513',
                'warung-deep-brown': '#4A2C0B',
            },
            fontFamily: {
                heading: ['Archivo Black', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

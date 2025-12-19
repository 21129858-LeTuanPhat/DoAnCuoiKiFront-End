/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'scale-pulse': {
                    '0%, 100%': { transform: 'scale(0.7)' },
                    '50%': { transform: 'scale(1.1)' },
                },
            },
            animation: {
                'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
};

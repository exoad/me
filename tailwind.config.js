/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false,
    },
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "rich-black": "#141921",
                "sheen-gold": "#D3A635",
                "murrey": "#8C1D5A",
                "dutch-white": "##F1E4C1"
            }
        },
    },
    plugins: [],
}


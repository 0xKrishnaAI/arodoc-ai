/** @type {import('tailwindcss').Config} */
// Force rebuild
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: "#0891b2", // Cyan-600 - Fresh, Professional
                    foreground: "#ffffff",
                    50: "#ecfeff",
                    100: "#cffafe",
                    500: "#06b6d4",
                    600: "#0891b2",
                    700: "#0e7490",
                },
                secondary: {
                    DEFAULT: "#334155", // Slate-700
                    foreground: "#f8fafc",
                },
                accent: {
                    DEFAULT: "#f59e0b", // Amber-500
                    foreground: "#ffffff",
                },
                success: "#059669", // Emerald-600
                warning: "#d97706", // Amber-600
                danger: "#dc2626", // Red-600
                background: "#f0f9ff", // Sky-50 - Very subtle tint
                surface: "#ffffff",
            },
            boxShadow: {
                'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'glass-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            // Добавим кастомные значения, как в спеке
            borderRadius: {
                xl: "12px",
                "2xl": "16px",
                "3xl": "24px",
            },
            boxShadow: {
                DEFAULT: "0 4px 16px rgba(0,0,0,0.08)",
                md: "0 8px 24px rgba(0,0,0,0.1)",
            },
            // Кастомный easing для анимаций из спеки
            transitionTimingFunction: {
                "custom-bezier": "cubic-bezier(0.2,0.8,0.2,1)",
            },
        },
    },
    plugins: [],
};
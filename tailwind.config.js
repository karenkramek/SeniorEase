/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./web/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas do SeniorEase
        primary: "#2ecc71", // Verde
        secondary: "#3498db",
        accent: "#2ecc71",
        error: "#e74c3c",
        success: "#27ae60",
        warning: "#f39c12",
        info: "#3498db",
        background: "#f1f5f9",
        surface: "#ffffff",
        text: "#1a1a1a",
        "text-secondary": "#666666",
        border: "#e0e0e0",
        muted: "#999999",
      },
      spacing: {
        // Tokens de espaçamento do projeto
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
      borderRadius: {
        sm: "12px",
        md: "12px",
        lg: "12px",
        xl: "12px",
        "2xl": "12px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

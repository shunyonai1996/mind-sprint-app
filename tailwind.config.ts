module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "#3a7bc8",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "#3fa396",
        },
        background: "var(--color-background)",
        text: "var(--color-text)",
      },
    },
  },
  plugins: [],
}


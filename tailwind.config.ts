module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          dark: "#3a7bc8",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "#3fa396",
        },
        background: "var(--color-background)",
        text: {
          DEFAULT: 'var(--color-text)',
          dark: 'var(--color-dark-text)',
        },
        attr_dark: 'var(--color-dark-text)',
      },
    },
  },
  plugins: [],
}


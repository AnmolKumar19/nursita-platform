/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16213E",       // primary text / headers
        paper: "#F5F7FA",     // page background, cool not cream
        marigold: "#E8A33D",  // primary accent - warmth, "you got this"
        teal: "#0F766E",      // live / success indicator
        rule: "#C9CEDA",      // notebook rule-line grey
        rust: "#C2483B",      // margin-line red, sparingly
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "ruled-paper":
          "repeating-linear-gradient(to bottom, transparent, transparent 35px, #C9CEDA33 36px)",
      },
    },
  },
  plugins: [],
};

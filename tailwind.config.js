/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        carbon: "#090909",
        graphite: "#141414",
        gunmetal: "#83868b",
        lime: "#b3f835",
        electric: "#92ef00",

        background: "#040404",
        foreground: "#fafafa",
        card: "#0f0f0f",
        "card-foreground": "#fafafa",
        popover: "#0f0f0f",
        "popover-foreground": "#fafafa",
        primary: "#b3f835",
        "primary-foreground": "#060606",
        secondary: "#1b1b1b",
        "secondary-foreground": "#fafafa",
        muted: "#1b1b1b",
        "muted-foreground": "#9b9fa3",
        accent: "#b3f835",
        "accent-foreground": "#060606",
        destructive: "#ee343b",
        "destructive-foreground": "#fafafa",
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.1)",
        ring: "#b3f835",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        // Matches the web app's "font-display font-extrabold italic" combo
        display: ["Exo2_800ExtraBold_Italic"],
        // Matches the web app's "font-display font-black italic" combo
        "display-black": ["Exo2_900Black_Italic"],
      },
    },
  },
  plugins: [],
};

// Settings
const settingsScreens = require("./tailwind.settings.screens");
const settingsFontSizes = require("./tailwind.settings.fontSizes");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: settingsScreens,
    fontSize: settingsFontSizes,
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
    extend: {
      colors: {
        inherit: "inherit",
        transparent: "transparent",
        current: "currentColor",
        black: "#000000",
        white: "#FFFFFF",
        pageBG: "var(--pageBG)",
        pageText: "var(--pageText)",
      },
      borderWidth: {
        10: "10px",
        12: "12px",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};

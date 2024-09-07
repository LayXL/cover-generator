const plugin = require("tailwindcss/plugin")

// noinspection JSUnusedGlobalSymbols
/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem",
      },
      padding: {
        container: "1rem",
      },
      spacing: {
        "safe-area-bottom": "var(--safe-area-bottom)",
      },
      colors: {
        primary: "rgb(var(--ma-theme-bg-primary), <alpha-value>)",
        surface: "rgb(var(--ma-theme-bg-surface), <alpha-value>)",
        inversed: "rgb(var(--ma-theme-bg-inversed), <alpha-value>)",
        accent: "rgb(var(--ma-theme-bg-accent), <alpha-value>)",
        on: {
          accent: "rgb(var(--ma-theme-bg-on-accent), <alpha-value>)",
        },
        destructive: "rgb(var(--ma-theme-destructive), <alpha-value>)",
        modal: "var(--vkui--color_background_modal)",
      },
      backgroundColor: {
        primary: "rgb(var(--ma-theme-bg-primary), <alpha-value>)",
        surface: "rgb(var(--ma-theme-bg-surface), <alpha-value>)",
        accent: "rgb(var(--ma-theme-bg-accent), <alpha-value>)",
        on: {
          accent: "rgb(var(--ma-theme-bg-on-accent), <alpha-value>)",
        },
      },
      textColor: {
        primary: "rgb(var(--ma-theme-text-primary), <alpha-value>)",
        accent: "rgb(var(--ma-theme-text-accent), <alpha-value>)",
        on: {
          accent: "rgb(var(--ma-theme-text-on-accent), <alpha-value>)",
          inversed: "rgb(var(--ma-theme-bg-primary), <alpha-value>)",
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        appear: "appear 0.3s ease-in-out",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("ios", "body.ios &")
      addVariant("android", "body.android &")
      addVariant("macos", "body.macos &")
      addVariant("windows", "body.windows &")
      addVariant("desktop", "body.desktop &")
      addVariant("mobile", "body.mobile &")
      addVariant("tg", "body.telegram &")
      addVariant("vk", "body.vk &")
    }),
    plugin(({ addVariant }) => {
      addVariant("hocus", ["body:not(.mobile) &:hover", "body.mobile &:active"])
    }),
  ],
}

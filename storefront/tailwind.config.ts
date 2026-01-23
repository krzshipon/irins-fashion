import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--color-primary)",
                    light: "var(--color-primary-light)",
                    dark: "var(--color-primary)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    light: "var(--color-secondary-light)",
                    dark: "var(--color-secondary)",
                },
                background: "var(--color-background)",
                surface: "var(--color-surface)",
                "surface-dim": "var(--color-surface-dim)",
                border: "var(--color-border)",
                text: {
                    main: "var(--color-text-main)",
                    muted: "var(--color-text-muted)",
                },
                success: "var(--color-success)",
                error: "var(--color-error)",
                foreground: "var(--color-text-main)",
            },
            fontFamily: {
                base: ["var(--font-family-base)"],
                display: ["var(--font-family-display)"],
            },
            spacing: {
                xs: "var(--spacing-xs)",
                sm: "var(--spacing-sm)",
                md: "var(--spacing-md)",
                lg: "var(--spacing-lg)",
                xl: "var(--spacing-xl)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                full: "var(--radius-full)",
            },
        },
    },
    plugins: [],
};
export default config;

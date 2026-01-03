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
                background: "var(--color-background)",
                foreground: "var(--color-text-main)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    light: "var(--color-primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    light: "var(--color-secondary-light)",
                },
                text: {
                    main: "var(--color-text-main)",
                    muted: "var(--color-text-muted)",
                },
                border: "var(--color-border)",
                success: "var(--color-success)",
                error: "var(--color-error)",
            },
        },
    },
    plugins: [],
};
export default config;

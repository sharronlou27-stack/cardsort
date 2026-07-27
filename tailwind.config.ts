import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        groupr: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          surface2: "var(--surface-2)",
          topbar: "var(--topbar-bg)",
          line: "var(--border)",
          ink: "var(--text)",
          inkMuted: "var(--text-muted)",
          inkFaint: "var(--text-faint)",
          accent: "var(--accent)",
          accentStrong: "var(--accent-strong)",
          accentSoft: "var(--accent-soft)",
          onAccent: "var(--on-accent)",
          good: "var(--good)",
          goodBar: "var(--good-bar)",
          watch: "var(--watch)",
          watchBar: "var(--watch-bar)",
          watchSoft: "var(--watch-soft)",
          danger: "var(--danger)",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        groupr: "0 1px 2px rgba(4, 20, 15, 0.05), 0 10px 26px -14px rgba(4, 20, 15, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;

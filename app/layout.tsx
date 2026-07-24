import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Groupr Food Survey",
  description: "Help us validate how food is grouped in the Groupr app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}

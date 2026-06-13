import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentBridge AI — Relocation & Onboarding for International Talent in Germany",
  description:
    "TalentBridge AI helps German companies hire and onboard international employees with a guided visa, relocation, and integration workflow powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

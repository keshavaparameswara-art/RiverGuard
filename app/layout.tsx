import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiverGuard | AI Encroachment Detection",
  description: "AI-powered riverbank encroachment detection system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

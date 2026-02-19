import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APVILLELA // Backend Engineer",
  description:
    "Alexandre Villela — Backend systems engineer specialising in distributed systems, high-performance APIs, and cloud infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmMono.variable}>
      <body style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
        {children}
      </body>
    </html>
  );
}

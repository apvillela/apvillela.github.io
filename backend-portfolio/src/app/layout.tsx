import type { Metadata } from "next";
import { IBM_Plex_Mono, Archivo } from "next/font/google";
import "./globals.css";

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexandre Villela — Backend Engineer",
  description:
    "Alexandre Villela — Backend systems engineer specialising in distributed systems, high-performance APIs, and cloud infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmMono.variable} ${archivo.variable}`}
    >
      <head>
        {/* reveal-on-scroll only hides content when JS is actually running */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

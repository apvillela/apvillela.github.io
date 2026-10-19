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
  title: "Alexandre Villela | Backend Engineer",
  description:
    "Alexandre Villela, backend systems engineer specialising in distributed systems, high-performance APIs, and cloud infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmMono.variable} ${archivo.variable}`}
    >
      <head>
        {/* reveal-on-scroll only hides content when JS is actually running;
            the theme is set here, before paint, so dark visitors never see a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add("js");var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

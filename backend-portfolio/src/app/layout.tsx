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

const DESCRIPTION =
  "Backend engineer working across async pipelines, serverless infrastructure and LLM agents in production.";

export const metadata: Metadata = {
  metadataBase: new URL("https://apvillela.github.io"),
  title: "Alexandre Villela | Backend Engineer",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Alexandre Villela",
    title: "Alexandre Villela | Backend Engineer",
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Alexandre Villela, Backend Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexandre Villela | Backend Engineer",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
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
        <meta name="theme-color" content="#E9E7E0" />
        {/* reveal-on-scroll only hides content when JS is actually running;
            the theme is set here, before paint, so dark visitors never see a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add("js");var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t;if(t==="dark")document.querySelector('meta[name="theme-color"]').setAttribute("content","#0F1D36")})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { IBM_Plex_Mono, Archivo } from "next/font/google";
import "./globals.css";

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "600", "700"],
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
  alternates: { canonical: "/" },
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
        {/* Runs before first paint: picks the theme so dark visitors never see a
            flash, and drives the reveal-on-scroll without waiting for the React
            bundle. Content already on screen at DOMContentLoaded shows at once;
            only what scrolls in later is animated (Web Animations API, so no
            attributes change under React's hydration). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t;if(t==="dark")document.querySelector('meta[name="theme-color"]').setAttribute("content","#0F1D36");
if(!("IntersectionObserver"in window)||!Element.prototype.animate||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
d.classList.add("js");
function reveal(){var first=true;var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);e.target.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:first?0:350,easing:"ease",fill:"forwards"})});first=false},{threshold:0.1,rootMargin:"0px 0px -40px 0px"});document.querySelectorAll(".reveal").forEach(function(el){io.observe(el)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",reveal);else reveal()})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

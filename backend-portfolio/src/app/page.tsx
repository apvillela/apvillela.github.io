"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ============================================================
   DATA
   ============================================================ */

const ME = {
  handle:   "apvillela",
  name:     "Alexandre Villela",
  role:     "Backend Engineer",
  email:    "ap.villela10@gmail.com",
  github:   "github.com/apvillela",
  linkedin: "linkedin.com/in/alexandre-pereira-villela",
};

interface Shot {
  src:     string;
  label:   string;   // short name — the thing this shot proves
  caption: string;
  width:   number;
  height:  number;
}

/* A project shows a walkthrough video, a set of stills, or nothing yet. */
type Media =
  | { kind: "video"; videoId: string }
  | { kind: "shots"; shots: Shot[] }
  | { kind: "none" };

interface Project {
  id:          string;
  title:       string;
  description: string;
  tools:       string[];
  media:       Media;
  status:      "PRODUCTION" | "OPEN SOURCE" | "ARCHIVED" | "WIP";
  year:        string;
}

const PROJECTS: Project[] = [
  {
    id:          "01",
    title:       "Decifra",
    description:
      "WhatsApp and Telegram agent that turns Brazilian public-education editais into plain language. Every claim carries the section it came from — and when the corpus does not cover the question, the agent refuses and hands over the official channel instead of guessing. 24 editais, 265 openings and 69 geolocated campuses indexed in Postgres; recommendations respect both travel distance and the enrolment calendar. Voice notes in Portuguese, Spanish and Haitian Creole get answered in the language they were spoken.",
    tools:       ["Python", "Google ADK", "Gemini", "FastAPI", "PostgreSQL", "pgvector", "PostGIS", "Docker"],
    media: {
      kind: "shots",
      shots: [
        {
          src:     "/shots/decifra-cited.webp",
          label:   "Cited",
          caption: "A course question answered from the corpus — the reply names Edital 05/DEING/2024/1 and the annex it read.",
          width:   1280,
          height:  720,
        },
        {
          src:     "/shots/decifra-refused.webp",
          label:   "Refused",
          caption: "Asked for a medical course the corpus does not hold, the agent declines and forwards the institution's own portal.",
          width:   1280,
          height:  720,
        },
        {
          src:     "/shots/decifra-panel.webp",
          label:   "Provenance",
          caption: "Live wall for the demo: every turn lands here as answered-with-citation or refused, read straight off the answer log.",
          width:   1760,
          height:  1100,
        },
      ],
    },
    status:      "WIP",
    year:        "2026",
  },
  {
    id:          "02",
    title:       "Halos",
    description:
      "Community platform for Catholic parishes, live at halos.com.br. Members post from a Mass, a rosary or a study group, and the feed threads reactions and comments inside the community it belongs to. Next.js on Vercel with Firebase underneath: Firestore listeners keep the feed live without polling, Cloud Functions handle fan-out and notifications, and security rules scope every read to the communities a member actually joined. Write paths are rate-limited through Upstash; the whole interface is translated with next-intl.",
    tools:       ["TypeScript", "Next.js", "Firebase", "Firestore", "Cloud Functions", "Upstash Redis", "next-intl", "Vercel"],
    media: {
      kind: "shots",
      shots: [
        {
          src:     "/shots/halos-feed.webp",
          label:   "Feed",
          caption: "A member's home feed: the community they belong to, then posts from Mass and the rosary with reactions threaded underneath.",
          width:   535,
          height:  1066,
        },
      ],
    },
    status:      "PRODUCTION",
    year:        "2026",
  },
  {
    id:          "03",
    title:       "Sentinel",
    description:
      "Serverless lead-enrichment pipeline. A TypeScript Lambda validates the incoming lead and queues it to SQS; a Python Lambda then runs a LangChain ReAct agent that pulls comparable accounts out of Pinecone and hands them to a deterministic scorer — the model supplies the reasoning, not the number. Results land in DynamoDB, and the table stream carries them on to BigQuery for the funnel view. Declared end to end in AWS SAM.",
    tools:       ["Python", "TypeScript", "AWS SAM", "Lambda", "SQS", "DynamoDB", "LangChain", "Pinecone", "Gemini", "BigQuery"],
    media:       { kind: "none" },
    status:      "WIP",
    year:        "2026",
  },
  {
    id:          "04",
    title:       "Promo Bot",
    description:
      "Always-on watcher for retail price drops. A FastAPI service polls Zara, Cotton On and VTEX storefronts every twenty minutes, diffs each hit against SQLite state and pushes only what is new to Telegram — with quiet hours, so it never wakes you at 3am. Outbound messages queue through Redis with AOF persistence and survive a restart, and every watch tracks its own health: a source that starts failing says so instead of going quietly silent. Ships as a Docker image.",
    tools:       ["Python", "FastAPI", "APScheduler", "Redis", "SQLite", "Telegram API", "Docker"],
    media:       { kind: "none" },
    status:      "PRODUCTION",
    year:        "2026",
  },
];

const ABOUT = [
  "Backend engineer with 2+ years building systems at scale.",
  "APIs that don't fall over, pipelines that don't lose data, and infrastructure that only pages you when it matters.",
  "Ship boring infra. Build exciting products.",
];

/* ============================================================
   HELPERS
   ============================================================ */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in-view");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function YouTube({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="spec-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

const PLATE_LETTERS = ["A", "B", "C", "D", "E", "F"];

/* Stills tipped into the document as plates: an index strip when there is more
   than one, then a mount with a printed margin carrying the caption. */
function Shots({ shots, title }: { shots: Shot[]; title: string }) {
  const [active, setActive] = useState(0);
  const shot = shots[active];

  return (
    <div className="spec-shots">
      {shots.length > 1 && (
        <div className="spec-shot-tabs" role="group" aria-label={`${title} — screenshots`}>
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className="spec-shot-tab"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              PL. {PLATE_LETTERS[i]} · {s.label}
            </button>
          ))}
        </div>
      )}

      <figure className="spec-plate">
        <div className="spec-plate-mount">
          <Image
            src={shot.src}
            alt={shot.caption}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 640px) 100vw, 1040px"
            className="spec-plate-img"
          />
        </div>
        <figcaption className="spec-plate-cap">
          <span className="spec-plate-ref">PL. {PLATE_LETTERS[active]}</span>
          {shot.caption}
        </figcaption>
      </figure>
    </div>
  );
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.media.kind === "shots") {
    return <Shots shots={project.media.shots} title={project.title} />;
  }
  if (project.media.kind === "video") {
    return <YouTube videoId={project.media.videoId} title={project.title} />;
  }
  return null;
}

/* ============================================================
   PAGE
   ============================================================ */

const STATUS_COLOR: Record<Project["status"], string> = {
  PRODUCTION:    "var(--blue)",
  "OPEN SOURCE": "var(--ink)",
  ARCHIVED:      "var(--faint)",
  WIP:           "var(--red)",
};

export default function Home() {
  useReveal();

  return (
    <div className="theme-spec">
      <nav className="spec-nav">
        <div className="spec-nav-inner">
          <span style={{ fontWeight: 700 }}>APV—PORTFOLIO</span>
          <div className="spec-nav-links">
            <a href="#identity">§1 IDENTITY</a>
            <a href="#work">§2 WORK</a>
            <a href="#contact">§3 CONTACT</a>
          </div>
          <span style={{ color: "var(--faint)" }}>REV. 2026.08</span>
        </div>
      </nav>

      <div className="spec-frame">
        {/* Masthead */}
        <header style={{ padding: "clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 64px)" }}>
          <h1 className="spec-h1">
            Alexandre
            <br />
            Villela
          </h1>

          <div style={{ margin: "clamp(28px, 4vw, 44px) 0 0" }}>
            <dl className="spec-meta">
              <div>
                <dt>ROLE</dt>
                <dd>{ME.role}</dd>
              </div>
              <div>
                <dt>MAINTAINER</dt>
                <dd>{ME.handle}</dd>
              </div>
            </dl>
          </div>
        </header>

        {/* §1 Identity */}
        <section id="identity" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§1</span>
            <h2 className="spec-sec-title">Identity</h2>
          </div>
          {ABOUT.map((line, i) => (
            <div key={i} className="spec-clause reveal">
              <span className="spec-clause-num">1.{i + 1}</span>
              <p>{line}</p>
            </div>
          ))}
        </section>

        {/* §2 Work */}
        <section id="work" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§2</span>
            <h2 className="spec-sec-title">Shipped work</h2>
          </div>
          {PROJECTS.map((p) => (
            <figure key={p.id} className="spec-fig reveal">
              <figcaption className="spec-fig-caption">
                <span className="spec-fig-num">FIG. {p.id}</span>
                <span className="spec-fig-title">{p.title}</span>
                <span className="spec-status" style={{ color: STATUS_COLOR[p.status] }}>
                  {p.status}
                </span>
                <span className="spec-fig-year">{p.year}</span>
              </figcaption>
              <ProjectMedia project={p} />
              <p className="spec-fig-desc">{p.description}</p>
              <ul className="spec-tools">
                {p.tools.map((t) => (
                  <li key={t} className="spec-tool">{t}</li>
                ))}
              </ul>
            </figure>
          ))}
        </section>

        {/* §3 Contact */}
        <section id="contact" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§3</span>
            <h2 className="spec-sec-title">Correspondence</h2>
          </div>
          <div className="reveal">
            {[
              { label: "EMAIL",    href: `mailto:${ME.email}`,        text: ME.email    },
              { label: "GITHUB",   href: `https://${ME.github}`,      text: ME.github   },
              { label: "LINKEDIN", href: `https://${ME.linkedin}`,    text: ME.linkedin },
            ].map((ref, i) => (
              <div key={ref.label} className="spec-ref">
                <span className="spec-ref-num">[{i + 1}]</span>
                <span className="spec-ref-label">{ref.label}</span>
                <a href={ref.href} target={ref.label === "EMAIL" ? undefined : "_blank"} rel="noreferrer">
                  {ref.text}
                </a>
              </div>
            ))}
            <a className="spec-cta" href={`mailto:${ME.email}?subject=Backend role`}>
              Open correspondence →
            </a>
          </div>
        </section>

        <footer className="spec-footer">— End of document · APV—PORTFOLIO · REV. 2026.08 —</footer>
      </div>
    </div>
  );
}

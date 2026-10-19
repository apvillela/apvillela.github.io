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

interface ProjectLink {
  label: string;   // SRC | LIVE
  href:  string;
}

interface Project {
  id:       string;
  title:    string;
  summary:  string;     // one line: what it is, for whom
  notes:    string[];   // the engineering decisions, drawing-notes style
  tools:    string[];
  links?:   ProjectLink[];
  media:    Media;
  status?:  "PRODUCTION" | "OPEN SOURCE" | "ARCHIVED" | "WIP";
  year:     string;
}

const PROJECTS: Project[] = [
  {
    id:      "01",
    title:   "Decifra",
    summary:
      "Conversational agent that reads Brazilian public-education editais and answers over WhatsApp and Telegram — every answer names the document and section it came from.",
    notes: [
      "Out-of-corpus questions get a refusal and the institution's official channel, never a guess. The demo wall logs every turn as cited or refused.",
      "24 editais, 265 openings and 69 campuses indexed in Postgres with pgvector and PostGIS; recommendations weigh travel distance against the enrolment calendar.",
      "Voice notes in Portuguese, Spanish or Haitian Creole are answered in the language they were spoken.",
    ],
    tools:   ["Google ADK", "Gemini", "PostgreSQL", "FastAPI"],
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
    year:        "2026",
  },
  {
    id:      "02",
    title:   "Halos",
    summary:
      "Community platform for Catholic parishes — members post from a Mass, a rosary or a study group, and the feed threads it all inside the right community.",
    notes: [
      "Feeds stay live through Firestore listeners, not polling; Cloud Functions carry fan-out and notifications.",
      "Security rules scope every read to the communities a member actually joined.",
      "Write paths pass through Upstash rate limiting before they touch Firestore.",
    ],
    tools:   ["Next.js", "Firebase", "Cloud Functions", "Upstash Redis"],
    links:   [{ label: "LIVE", href: "https://halos.com.br" }],
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
    id:      "03",
    title:   "Sentinel",
    summary:
      "Serverless lead-enrichment pipeline on AWS: an LLM agent gathers the evidence, a deterministic scorer sets the number.",
    notes: [
      "The model supplies reasoning, never the score — a ReAct agent pulls comparable accounts from Pinecone and hands them to deterministic scoring.",
      "Validate → SQS → enrich, with DynamoDB streams carrying results on to BigQuery for the funnel view. The whole stack is declared in AWS SAM.",
    ],
    tools:   ["AWS Lambda", "SQS", "LangChain", "Pinecone"],
    links:   [{ label: "SRC", href: "https://github.com/apvillela/aws-ai-agent" }],
    media:   { kind: "none" },
    year:    "2026",
  },
  {
    id:      "04",
    title:   "Promo Bot",
    summary:
      "Always-on watcher over four high-end storefronts, fanning sales out to two Telegram channels.",
    notes: [
      "Notifications leave through a Redis Streams consumer group — a process that dies mid-send redelivers on the next boot instead of losing the promo.",
      "One adapter per storefront normalises the payload, so a retailer reshaping its JSON is a one-file fix that never reaches filtering, dedupe or notify.",
      "Every watch tracks its own health: a source that starts failing says so instead of going quietly silent.",
    ],
    tools:   ["Python", "Redis Streams", "SQLite", "Docker"],
    media:   { kind: "none" },
    status:  "PRODUCTION",
    year:    "2026",
  },
];

const ABOUT = [
  "Backend engineer working across async pipelines, serverless infrastructure and LLM agents in production.",
  "The common thread is designing around failure: messages that redeliver instead of vanish, agents that cite or refuse instead of guess, sources that report their own degradation.",
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

/* A lone portrait still is too narrow to carry the full column, so it runs
   beside the prose instead of stranding empty paper either side of it. */
function soloPortrait(project: Project): Shot | null {
  if (project.media.kind !== "shots" || project.media.shots.length !== 1) return null;
  const shot = project.media.shots[0];
  return shot.height > shot.width ? shot : null;
}

function BarePlate({ shot }: { shot: Shot }) {
  return (
    <div className="spec-plate spec-plate--bare">
      <div className="spec-plate-mount">
        <Image
          src={shot.src}
          alt={shot.caption}
          width={shot.width}
          height={shot.height}
          sizes="(max-width: 640px) 100vw, 320px"
          className="spec-plate-img"
        />
      </div>
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

const STATUS_COLOR: Record<NonNullable<Project["status"]>, string> = {
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
          {PROJECTS.map((p) => {
            const solo = soloPortrait(p);
            return (
              <figure key={p.id} className={`spec-fig reveal${solo ? " spec-fig--aside" : ""}`}>
                <figcaption className="spec-fig-caption">
                  <span className="spec-fig-num">FIG. {p.id}</span>
                  <span className="spec-fig-title">{p.title}</span>
                  {p.status && (
                    <span className="spec-status" style={{ color: STATUS_COLOR[p.status] }}>
                      {p.status}
                    </span>
                  )}
                  {p.links?.map((l) => (
                    <a key={l.href} className="spec-fig-link" href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                  <span className="spec-fig-year">{p.year}</span>
                </figcaption>
                <div className="spec-fig-body">
                  {solo ? <BarePlate shot={solo} /> : <ProjectMedia project={p} />}
                  <div>
                    {solo && <p className="spec-plate-note">{solo.caption}</p>}
                    <p className="spec-fig-desc">{p.summary}</p>
                    <ol className="spec-notes" aria-label={`${p.title} — engineering notes`}>
                      {p.notes.map((n, i) => (
                        <li key={i}>
                          <span className="spec-note-num">{i + 1}.</span>
                          {n}
                        </li>
                      ))}
                    </ol>
                    <ul className="spec-tools">
                      {p.tools.map((t) => (
                        <li key={t} className="spec-tool">{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </figure>
            );
          })}
        </section>

        {/* §3 Contact */}
        <section id="contact" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§3</span>
            <h2 className="spec-sec-title">Contact</h2>
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
          </div>
        </section>

        <footer className="spec-footer">APV—PORTFOLIO · REV. 2026.08</footer>
      </div>
    </div>
  );
}

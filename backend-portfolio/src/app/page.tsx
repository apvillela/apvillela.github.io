"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ============================================================
   DATA — shared by both versions. Edit here only.
   ============================================================ */

const ME = {
  handle:   "apvillela",
  name:     "Alexandre Villela",
  role:     "Backend Engineer",
  location: "Earth, UTC+0",
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

/* A project shows either a walkthrough video or a set of stills. */
type Media =
  // Replace with your actual YouTube video ID
  // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ"
  | { kind: "video"; videoId: string }
  | { kind: "shots"; shots: Shot[] };

interface Project {
  id:          string;
  title:       string;
  description: string;
  stack:       string[];
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
    stack:       ["Python", "Google ADK", "Gemini", "FastAPI", "PostgreSQL", "pgvector", "PostGIS", "Docker"],
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
    title:       "Distributed Cache Engine",
    description:
      "Distributed cache with consistent hashing, 3× replication and automatic failover — sustains 100k req/s at sub-millisecond p99.",
    stack:       ["Go", "gRPC", "Redis", "Kubernetes"],
    media:       { kind: "video", videoId: "YOUR_VIDEO_ID_1" },
    status:      "PRODUCTION",
    year:        "2024",
  },
  {
    id:          "03",
    title:       "Event Stream Processor",
    description:
      "Real-time pipeline ingesting 5M+ events a day with exactly-once semantics, dead-letter queues and zero message loss.",
    stack:       ["Python", "Kafka", "PostgreSQL", "FastAPI"],
    media:       { kind: "video", videoId: "YOUR_VIDEO_ID_2" },
    status:      "PRODUCTION",
    year:        "2024",
  },
  {
    id:          "04",
    title:       "API Gateway Mesh",
    description:
      "Zero-dependency API gateway in Rust — JWT validation, adaptive rate limiting, circuit breaking and mTLS built in.",
    stack:       ["Rust", "PostgreSQL", "Prometheus", "OpenTelemetry"],
    media:       { kind: "video", videoId: "YOUR_VIDEO_ID_3" },
    status:      "OPEN SOURCE",
    year:        "2023",
  },
];

const SKILLS = [
  { category: "LANGUAGES",      items: ["Python", "TypeScript", "Java", "SQL", "Bash"] },
  { category: "DATABASES",      items: ["MongoDB", "MySQL", "Redis"] },
  { category: "INFRASTRUCTURE", items: ["Docker", "Kubernetes", "Linux"] },
];

const ABOUT = [
  "Backend engineer with 2+ years building systems at scale.",
  "APIs that don't fall over, pipelines that don't lose data, and infrastructure that only pages you when it matters.",
  "Ship boring infra. Build exciting products.",
];

type Version = "spec" | "crt";

/* ============================================================
   HELPERS
   ============================================================ */

function useReveal(version: Version) {
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
  }, [version]);
}

function YouTube({ videoId, title, className }: { videoId: string; title: string; className: string }) {
  return (
    <div className={className}>
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

const filename = (label: string) => `${label.toLowerCase().replace(/ /g, "_")}.webp`;

/* Stills for projects with no walkthrough video. Same footprint as the video
   block, so the rhythm of the work section doesn't break — but it speaks each
   version's own language: tipped-in plates in SPEC, a file viewer in CRT. */
function Shots({ shots, variant, title }: { shots: Shot[]; variant: Version; title: string }) {
  const [active, setActive] = useState(0);
  const shot = shots[active];
  const p = variant === "spec" ? "spec" : "crt";

  return (
    <div className={`${p}-shots`}>
      <div className={`${p}-shot-tabs`} role="group" aria-label={`${title} — screenshots`}>
        {shots.map((s, i) => (
          <button
            key={s.src}
            type="button"
            className={`${p}-shot-tab`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {variant === "spec" ? `PL. ${PLATE_LETTERS[i]} · ${s.label}` : filename(s.label)}
          </button>
        ))}
      </div>

      <figure className={`${p}-plate`}>
        {variant === "crt" && (
          <div className="crt-plate-bar">
            <span>{filename(shot.label)}</span>
            <span>
              [{active + 1}/{shots.length}]
            </span>
          </div>
        )}
        <div className={`${p}-plate-mount`}>
          <Image
            src={shot.src}
            alt={shot.caption}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 640px) 100vw, 1040px"
            className={`${p}-plate-img`}
          />
        </div>
        <figcaption className={`${p}-plate-cap`}>
          {variant === "spec" && <span className="spec-plate-ref">PL. {PLATE_LETTERS[active]}</span>}
          {shot.caption}
        </figcaption>
      </figure>
    </div>
  );
}

function ProjectMedia({ project, variant }: { project: Project; variant: Version }) {
  if (project.media.kind === "shots") {
    return <Shots shots={project.media.shots} variant={variant} title={project.title} />;
  }
  return (
    <YouTube
      videoId={project.media.videoId}
      title={project.title}
      className={variant === "spec" ? "spec-video" : "crt-video"}
    />
  );
}

/* ============================================================
   VERSION A — SPEC (engineering document)
   ============================================================ */

const SPEC_STATUS_COLOR: Record<Project["status"], string> = {
  PRODUCTION:    "var(--blue)",
  "OPEN SOURCE": "var(--ink)",
  ARCHIVED:      "var(--faint)",
  WIP:           "var(--red)",
};

function SpecVersion() {
  return (
    <div>
      <nav className="spec-nav">
        <div className="spec-nav-inner">
          <span style={{ fontWeight: 700 }}>APV—PORTFOLIO</span>
          <div className="spec-nav-links">
            <a href="#identity">§1 IDENTITY</a>
            <a href="#stack">§2 STACK</a>
            <a href="#work">§3 WORK</a>
            <a href="#contact">§4 CONTACT</a>
          </div>
          <span style={{ color: "var(--faint)" }}>REV. 2026.07</span>
        </div>
      </nav>

      <div className="spec-frame">
        {/* Masthead */}
        <header style={{ padding: "clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 64px)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "clamp(28px, 4vw, 44px)",
            }}
          >
            <span className="spec-eyebrow">Technical specification of one engineer</span>
            <span className="spec-stamp">Open to work</span>
          </div>

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
              <div>
                <dt>LOCATION</dt>
                <dd>{ME.location}</dd>
              </div>
              <div>
                <dt>CLASSIFICATION</dt>
                <dd>PUBLIC</dd>
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

        {/* §2 Stack */}
        <section id="stack" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§2</span>
            <h2 className="spec-sec-title">Stack</h2>
          </div>
          <div className="reveal">
            {SKILLS.map((group) => (
              <div key={group.category} className="spec-row">
                <div className="spec-row-label">{group.category}</div>
                <div className="spec-row-value">{group.items.join("  ·  ")}</div>
              </div>
            ))}
          </div>
        </section>

        {/* §3 Work */}
        <section id="work" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§3</span>
            <h2 className="spec-sec-title">Shipped work</h2>
          </div>
          {PROJECTS.map((p) => (
            <figure key={p.id} className="spec-fig reveal">
              <figcaption className="spec-fig-caption">
                <span className="spec-fig-num">FIG. {p.id}</span>
                <span className="spec-fig-title">{p.title}</span>
                <span className="spec-status" style={{ color: SPEC_STATUS_COLOR[p.status] }}>
                  {p.status}
                </span>
                <span className="spec-fig-year">{p.year}</span>
              </figcaption>
              <ProjectMedia project={p} variant="spec" />
              <p className="spec-fig-desc">{p.description}</p>
              <div className="spec-fig-stack">STACK — {p.stack.join(" / ")}</div>
            </figure>
          ))}
        </section>

        {/* §4 Contact */}
        <section id="contact" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§4</span>
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

        <footer className="spec-footer">— End of document · APV—PORTFOLIO · REV. 2026.07 —</footer>
      </div>
    </div>
  );
}

/* ============================================================
   VERSION B — CRT (amber phosphor terminal)
   ============================================================ */

const CRT_STATUS_COLOR: Record<Project["status"], string> = {
  PRODUCTION:    "var(--amber)",
  "OPEN SOURCE": "var(--hi)",
  ARCHIVED:      "var(--dim)",
  WIP:           "#FF6B4A",
};

const slug = (title: string) => title.toLowerCase().replace(/ /g, "_");

function CrtVersion() {
  return (
    <div>
      <nav className="crt-nav">
        <div className="crt-nav-inner">
          <a href="#" className="crt-nav-logo">
            <span style={{ color: "var(--dim)" }}>~/</span>{ME.handle}
          </a>
          <div className="crt-nav-links">
            <a className="crt-nav-link" href="#about">--about</a>
            <a className="crt-nav-link" href="#stack">--stack</a>
            <a className="crt-nav-link" href="#work">--work</a>
            <a className="crt-nav-link" href="#contact">--contact</a>
          </div>
        </div>
      </nav>

      <div className="crt-wrap">
        {/* Hero */}
        <header
          style={{
            minHeight: "78vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(48px, 8vw, 80px) 0",
          }}
        >
          <div className="crt-prompt" style={{ marginBottom: "24px" }}>
            <span className="p">{ME.handle}@prod</span>:~$ whoami
          </div>
          <h1 className="crt-name" style={{ marginBottom: "28px" }}>
            Alexandre
            <br />
            Villela
            <span className="crt-cursor" />
          </h1>
          <p className="crt-sub" style={{ marginBottom: "40px", maxWidth: "560px" }}>
            backend engineer · 2+ yrs · distributed systems, high-throughput APIs
            and infrastructure that stays up.
          </p>
          <div className="crt-cta-stack" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a className="crt-btn" href="#work">./view_work</a>
            <a className="crt-btn ghost" href="#contact">./contact</a>
          </div>
        </header>

        {/* About */}
        <section id="about" className="crt-sec">
          <div className="crt-sec-cmd crt-prompt">
            <span className="p">$</span> cat about.txt
          </div>
          <div className="crt-out reveal">
            {ABOUT.map((line, i) => (
              <p key={i}>
                <span className="k">&gt;</span>{" "}
                {i === 2 ? <span className="h">&quot;{line}&quot;</span> : line}
              </p>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="crt-sec">
          <div className="crt-sec-cmd crt-prompt">
            <span className="p">$</span> tree stack/
          </div>
          <div className="crt-ls reveal">
            {SKILLS.map((group) => (
              <div key={group.category} className="crt-ls-row">
                <span className="crt-ls-dir">{group.category.toLowerCase()}/</span>
                <span className="crt-ls-items">{group.items.map((s) => s.toLowerCase()).join("  ")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Work */}
        <section id="work" className="crt-sec">
          <div className="crt-sec-cmd crt-prompt">
            <span className="p">$</span> ls work/ --sort=year
          </div>
          {PROJECTS.map((p) => (
            <article key={p.id} className="crt-proj reveal">
              <div className="crt-proj-head">
                <span className="crt-proj-idx">{p.id}/</span>
                <span className="crt-proj-title">{slug(p.title)}</span>
                <span className="crt-proj-tag" style={{ color: CRT_STATUS_COLOR[p.status] }}>
                  {p.status}
                </span>
                <span className="crt-proj-year">{p.year}</span>
              </div>
              <ProjectMedia project={p} variant="crt" />
              <p className="crt-proj-desc">{p.description}</p>
              <div className="crt-proj-stack">
                <span className="k">stack:</span> {p.stack.map((s) => s.toLowerCase()).join(" · ")}
              </div>
            </article>
          ))}
        </section>

        {/* Contact */}
        <section id="contact" className="crt-sec">
          <div className="crt-sec-cmd crt-prompt">
            <span className="p">$</span> contact --list
          </div>
          <div className="crt-contact-list reveal">
            {[
              { label: "EMAIL",    href: `mailto:${ME.email}`,     text: ME.email    },
              { label: "GITHUB",   href: `https://${ME.github}`,   text: ME.github   },
              { label: "LINKEDIN", href: `https://${ME.linkedin}`, text: ME.linkedin },
            ].map((c) => (
              <div key={c.label} className="crt-contact-row">
                <span className="crt-contact-label">{c.label}</span>
                <a href={c.href} target={c.label === "EMAIL" ? undefined : "_blank"} rel="noreferrer">
                  {c.text}
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <a className="crt-btn" href={`mailto:${ME.email}?subject=Backend role`}>
              ./send_mail
            </a>
          </div>
        </section>

        <footer className="crt-footer">
          <span>© {new Date().getFullYear()} {ME.name.toLowerCase()}</span>
          <span>built with next.js // no templates harmed</span>
        </footer>
      </div>
    </div>
  );
}

/* ============================================================
   VERSION TOGGLE + PAGE ROOT
   ============================================================ */

function VersionToggle({ version, onChange }: { version: Version; onChange: (v: Version) => void }) {
  return (
    <div className="vt" role="group" aria-label="Portfolio version">
      <button
        className="vt-btn"
        aria-pressed={version === "spec"}
        onClick={() => onChange("spec")}
      >
        01 SPEC
      </button>
      <button
        className="vt-btn"
        aria-pressed={version === "crt"}
        onClick={() => onChange("crt")}
      >
        02 CRT
      </button>
    </div>
  );
}

export default function Home() {
  const [version, setVersion] = useState<Version>("spec");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("v");
    const saved = localStorage.getItem("portfolio-version");
    const v = param ?? saved;
    if (v === "spec" || v === "crt") setVersion(v);
  }, []);

  useReveal(version);

  const change = (v: Version) => {
    setVersion(v);
    localStorage.setItem("portfolio-version", v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className={version === "spec" ? "theme-spec" : "theme-crt"}>
      {version === "spec" ? <SpecVersion /> : <CrtVersion />}
      <VersionToggle version={version} onChange={change} />
    </div>
  );
}

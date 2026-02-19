"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   DATA — edit these to personalise your portfolio
   ============================================================ */

const ME = {
  handle:   "apvillela",
  name:     "Alexandre Villela",
  role:     "Backend Engineer",
  location: "Earth, UTC+0",
  email:    "ap.villela10@gmail.com",   // ← your contact email
  github:   "github.com/apvillela",
  linkedin: "https://www.linkedin.com/in/alexandre-pereira-villela/",
};

interface Project {
  id:          string;
  title:       string;
  description: string;
  stack:       string[];
  // ↓ Replace each value with your actual YouTube video ID
  // e.g. for https://www.youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ"
  videoId:     string;
  status:      "PRODUCTION" | "OPEN SOURCE" | "ARCHIVED" | "WIP";
  year:        string;
  metrics?:    string;
}

const PROJECTS: Project[] = [
  {
    id:          "01",
    title:       "DISTRIBUTED_CACHE_ENGINE",
    description:
      "High-performance distributed caching system with consistent hashing, LRU eviction, replication factor 3, and automatic failover. Sustains 100k+ req/s with sub-millisecond p99 latency across 8-node clusters.",
    stack:       ["Go", "gRPC", "Redis", "Docker", "Kubernetes", "Prometheus"],
    videoId:     "YOUR_VIDEO_ID_1", // ← replace
    status:      "PRODUCTION",
    year:        "2024",
    metrics:     "100k req/s · p99 < 1ms · 3× replication",
  },
  {
    id:          "02",
    title:       "EVENT_STREAM_PROCESSOR",
    description:
      "Real-time streaming pipeline ingesting 5M+ events/day. Custom consumer groups, dead-letter queues, exactly-once semantics, and schema registry integration. Zero message loss across 99.97% uptime.",
    stack:       ["Python", "Apache Kafka", "PostgreSQL", "Redis", "FastAPI", "Avro"],
    videoId:     "YOUR_VIDEO_ID_2", // ← replace
    status:      "PRODUCTION",
    year:        "2024",
    metrics:     "5M events/day · 99.97% uptime · 0 message loss",
  },
  {
    id:          "03",
    title:       "API_GATEWAY_MESH",
    description:
      "Zero-dependency API gateway written in Rust. JWT validation, adaptive rate limiting, circuit breaker pattern, mTLS, and distributed tracing built-in. 10× lower memory footprint than comparable solutions.",
    stack:       ["Rust", "PostgreSQL", "Redis", "Prometheus", "Grafana", "OpenTelemetry"],
    videoId:     "YOUR_VIDEO_ID_3", // ← replace
    status:      "OPEN SOURCE",
    year:        "2023",
    metrics:     "10× less RAM · <200μs overhead · mTLS native",
  },
];

const SKILLS = [
  {
    category: "LANGUAGES",
    items: ["Python", "TypeScript","Java", "SQL", "Bash"],
  },
  {
    category: "DATABASES",
    items: ["MongoDB", "MySQL", "Redis"],
  },
  {
    category: "INFRASTRUCTURE",
    items: ["Docker", "Kubernetes", "Linux"],
  },
  
];

/* ============================================================
   HELPERS
   ============================================================ */

function useTypewriter(text: string, speed = 35, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function useUptime(startMs: number) {
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setUptime(Date.now() - startMs), 1000);
    return () => clearInterval(iv);
  }, [startMs]);
  const s = Math.floor(uptime / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

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

/* ============================================================
   NAV
   ============================================================ */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "--about",    href: "#about"   },
    { label: "--skills",   href: "#skills"  },
    { label: "--work",     href: "#work"    },
    { label: "--contact",  href: "#contact" },
  ];

  return (
    <nav
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        right:           0,
        zIndex:          100,
        borderBottom:    scrolled ? "1px solid var(--border2)" : "1px solid transparent",
        background:      scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter:  scrolled ? "blur(12px)" : "none",
        transition:      "all 0.3s ease",
        padding:         "0 clamp(20px, 4vw, 60px)",
        height:          "52px",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
      }}
    >
      {/* Logo */}
      <a
        href="#"
        style={{
          fontSize:      "13px",
          fontWeight:    500,
          color:         "var(--green)",
          textDecoration:"none",
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ color: "var(--dim)" }}>~/</span>{ME.handle}
        <span className="cursor" style={{ width: "7px", height: "13px" }} />
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2px" }} className="hidden-mobile">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontSize:      "11px",
              color:         "var(--dim)",
              textDecoration:"none",
              letterSpacing: "0.08em",
              padding:       "6px 12px",
              border:        "1px solid transparent",
              transition:    "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color        = "var(--green)";
              (e.currentTarget as HTMLElement).style.borderColor  = "var(--border2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color        = "var(--dim)";
              (e.currentTarget as HTMLElement).style.borderColor  = "transparent";
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--dim)" }}>
        <span className="status-online" />
        <span style={{ display: "none" }} id="nav-status">ONLINE</span>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const startTime = useRef(Date.now());
  const uptime    = useUptime(startTime.current);

  const boot = useTypewriter(
    "Initializing backend.portfolio v2.0.0 ...",
    28,
    300
  );
  const tagline = useTypewriter(
    "$ ./run --mode=showcase --stack=python,docker,fastapi,mongodb",
    22,
    1800
  );

  const sysStats = [
    { label: "HOST",      val: ME.handle },
    { label: "ROLE",      val: ME.role },
    { label: "LOCATION",  val: ME.location },
    { label: "UPTIME",    val: uptime },
    { label: "LOAD",      val: "0.42 0.38 0.31" },
    { label: "MEMORY",    val: "2.1G / 32G" },
    { label: "PROCESSES", val: "218 running" },
    { label: "STATUS",    val: "ALL SYSTEMS OK", green: true },
  ];

  return (
    <section
      id="hero"
      className="grid-bg scan-effect"
      style={{
        minHeight:   "100vh",
        padding:     "80px clamp(20px,4vw,60px) 60px",
        display:     "grid",
        gridTemplate:"1fr / 1fr",
        alignContent:"center",
        position:    "relative",
        overflow:    "hidden",
      }}
    >
      {/* Top boot line */}
      <div
        style={{
          position:    "absolute",
          top:         "60px",
          left:        "clamp(20px,4vw,60px)",
          fontSize:    "12px",
          color:       "var(--dim)",
          letterSpacing:"0.04em",
        }}
      >
        {boot.displayed}
        {!boot.done && <span className="cursor" />}
      </div>

      {/* Main content grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr auto",
          gap:                 "clamp(20px,4vw,60px)",
          alignItems:          "start",
        }}
      >
        {/* Left: big headline */}
        <div>
          {/* Top label */}
          <div
            style={{
              fontSize:     "11px",
              color:        "var(--dim)",
              letterSpacing:"0.25em",
              marginBottom: "24px",
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
            }}
          >
            <span className="status-online" />
            PORTFOLIO — {new Date().getFullYear()}
          </div>

          {/* Giant title */}
          <h1
            className="glitch flicker"
            data-text="BACKEND"
            style={{
              fontSize:    "clamp(72px, 16vw, 200px)",
              fontWeight:  700,
              lineHeight:  0.88,
              color:       "var(--bright)",
              letterSpacing:"-0.03em",
              marginBottom:"0px",
            }}
          >
            BACKEND
          </h1>
          <h1
            style={{
              fontSize:    "clamp(72px, 16vw, 200px)",
              fontWeight:  700,
              lineHeight:  0.88,
              color:       "var(--green)",
              letterSpacing:"-0.03em",
              marginBottom:"48px",
              textShadow:  "0 0 60px rgba(0,255,65,0.2)",
            }}
          >
            ENGINEER
          </h1>

          {/* Tagline */}
          <div
            style={{
              fontSize:    "clamp(11px, 1.4vw, 14px)",
              color:       "var(--text)",
              marginBottom:"40px",
              minHeight:   "24px",
              letterSpacing:"0.02em",
            }}
          >
            {tagline.displayed}
            {!tagline.done && <span className="cursor" style={{ width:"8px", height:"14px" }} />}
          </div>

          {/* CTA buttons */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <a
              href="#work"
              style={{
                display:       "inline-block",
                padding:       "12px 28px",
                border:        "1px solid var(--green)",
                color:         "var(--bg)",
                background:    "var(--green)",
                fontSize:      "12px",
                fontWeight:    600,
                letterSpacing: "0.12em",
                textDecoration:"none",
                textTransform: "uppercase",
                transition:    "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color      = "var(--green)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--green)";
                (e.currentTarget as HTMLElement).style.color      = "var(--bg)";
              }}
            >
              ./view_projects
            </a>
            <a
              href="#contact"
              style={{
                display:       "inline-block",
                padding:       "12px 28px",
                border:        "1px solid var(--border2)",
                color:         "var(--dim)",
                fontSize:      "12px",
                fontWeight:    500,
                letterSpacing: "0.12em",
                textDecoration:"none",
                textTransform: "uppercase",
                transition:    "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--amber)";
                (e.currentTarget as HTMLElement).style.color       = "var(--amber)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                (e.currentTarget as HTMLElement).style.color       = "var(--dim)";
              }}
            >
              ./contact
            </a>
          </div>
        </div>

        {/* Right: system stats terminal */}
        <div
          className="term-window"
          style={{
            minWidth:  "260px",
            alignSelf: "center",
            flexShrink:0,
          }}
        >
          <div className="term-bar">
            <div className="term-dot" />
            <div className="term-dot" />
            <div className="term-dot" />
            <span style={{ marginLeft:"4px" }}>sys_info.sh</span>
          </div>
          <div style={{ padding:"16px 18px", fontSize:"12px", lineHeight:"2" }}>
            {sysStats.map((s) => (
              <div key={s.label} style={{ display:"flex", gap:"12px" }}>
                <span style={{ color:"var(--dim)", minWidth:"90px", flexShrink:0 }}>
                  {s.label}
                </span>
                <span
                  style={{
                    color: s.green ? "var(--green)" : "var(--bright)",
                    fontWeight: s.green ? 600 : 400,
                    textShadow: s.green ? "0 0 8px rgba(0,255,65,0.5)" : "none",
                  }}
                >
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div
        style={{
          position:    "absolute",
          bottom:      "32px",
          left:        "clamp(20px,4vw,60px)",
          fontSize:    "10px",
          color:       "var(--muted)",
          letterSpacing:"0.15em",
          display:     "flex",
          alignItems:  "center",
          gap:         "12px",
        }}
      >
        <span>SCROLL</span>
        <div style={{ width:"40px", height:"1px", background:"var(--muted)" }} />
        <span>↓</span>
      </div>

      {/* Decorative corner lines */}
      <div style={{ position:"absolute", top:"52px", right:"clamp(20px,4vw,60px)", width:"80px", height:"80px",
        borderTop:"1px solid var(--border2)", borderRight:"1px solid var(--border2)" }} />
      <div style={{ position:"absolute", bottom:"0", left:"clamp(20px,4vw,60px)", width:"80px", height:"80px",
        borderBottom:"1px solid var(--border2)", borderLeft:"1px solid var(--border2)" }} />
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function About() {
  const lines = [
    { prompt: "$ whoami",                      out: ME.name,                          color: "var(--bright)" },
    { prompt: "$ cat role.txt",               out: ME.role,                           color: "var(--green)"  },
    { prompt: "$ uptime --human",             out: "2+ years building at scale",       color: "var(--text)"   },
    { prompt: "$ cat philosophy.txt",         out: "Fast. Resilient. Observable.",     color: "var(--amber)"  },
    { prompt: "$ ps aux | grep passion",      out: "distributed systems, databases, performance", color: "var(--text)" },
    { prompt: "$ echo $APPROACH",             out: "\"Ship boring infra. Build exciting products.\"", color: "var(--text)" },
  ];

  const stats = [
    { num: "2+",    label: "YEARS EXP"        },
    { num: "10+",   label: "PROJECTS SHIPPED"  },
    { num: "99.9%", label: "UPTIME SLA"        },
    { num: "∞",     label: "COFFEE / DAY"      },
  ];

  return (
    <section id="about" style={{ padding:"100px clamp(20px,4vw,60px)" }}>
      {/* Label */}
      <div className="section-label reveal" style={{ marginBottom:"60px" }}>
        <span>00 / ABOUT</span>
      </div>

      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap:                 "clamp(40px, 6vw, 80px)",
          alignItems:          "start",
        }}
      >
        {/* Terminal */}
        <div className="term-window reveal">
          <div className="term-bar">
            <div className="term-dot" />
            <div className="term-dot" />
            <div className="term-dot" />
            <span style={{ marginLeft:"4px" }}>about.sh — {ME.handle}@portfolio</span>
          </div>
          <div style={{ padding:"20px 22px" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ marginBottom:"14px" }}>
                <div style={{ fontSize:"12px", color:"var(--dim)", marginBottom:"2px" }}>
                  {l.prompt}
                </div>
                <div style={{ fontSize:"13px", color:l.color, paddingLeft:"16px" }}>
                  &gt; {l.out}
                </div>
              </div>
            ))}
            <div style={{ fontSize:"12px", color:"var(--dim)", marginTop:"8px" }}>
              $ <span className="cursor" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "1px",
              background:          "var(--border)",
              border:              "1px solid var(--border)",
              marginBottom:        "40px",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  background:  "var(--bg)",
                  padding:     "28px 24px",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="counter-num glow">{s.num}</div>
                <div style={{ fontSize:"10px", color:"var(--dim)", letterSpacing:"0.15em", marginTop:"8px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ fontSize:"13px", color:"var(--text)", lineHeight:"1.9" }}>
            I build the <span style={{ color:"var(--green)" }}>foundations</span> that make
            products scale — APIs that don&apos;t fall over, pipelines that don&apos;t lose data,
            and systems that wake you up at 3 AM only when it really matters.
            <br /><br />
            Obsessed with{" "}
            <span style={{ color:"var(--amber)" }}>latency</span>,{" "}
            <span style={{ color:"var(--amber)" }}>throughput</span>, and{" "}
            <span style={{ color:"var(--amber)" }}>reliability</span>.
            Allergic to unnecessary complexity.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS
   ============================================================ */

function Skills() {
  return (
    <section id="skills" style={{ padding:"100px clamp(20px,4vw,60px)", borderTop:"1px solid var(--border)" }}>
      <div className="section-label reveal" style={{ marginBottom:"60px" }}>
        <span>01 / STACK</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
        {SKILLS.map((group, gi) => (
          <div
            key={group.category}
            className="reveal"
            style={{
              display:             "grid",
              gridTemplateColumns: "200px 1fr",
              borderTop:           gi === 0 ? "1px solid var(--border2)" : "none",
              borderBottom:        "1px solid var(--border)",
              animationDelay:      `${gi * 0.08}s`,
            }}
          >
            {/* Category */}
            <div
              style={{
                padding:     "24px 0",
                paddingRight:"24px",
                fontSize:    "10px",
                color:       "var(--dim)",
                letterSpacing:"0.18em",
                fontWeight:  600,
                borderRight: "1px solid var(--border)",
                display:     "flex",
                alignItems:  "center",
              }}
            >
              {group.category}
            </div>

            {/* Items */}
            <div
              style={{
                display:   "flex",
                flexWrap:  "wrap",
                gap:       "8px",
                padding:   "24px",
                alignItems:"center",
              }}
            >
              {group.items.map((item) => (
                <span
                  key={item}
                  className="badge"
                  style={{ cursor:"default" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PROJECT CARD
   ============================================================ */

function ProjectCard({ project, flip }: { project: Project; flip?: boolean }) {
  const statusColor = {
    PRODUCTION:   "var(--green)",
    "OPEN SOURCE":"var(--amber)",
    ARCHIVED:     "var(--muted)",
    WIP:          "var(--red)",
  }[project.status];

  return (
    <div
      className="reveal"
      style={{
        borderTop:   "1px solid var(--border2)",
        padding:     "clamp(40px, 6vw, 80px) 0",
      }}
    >
      {/* Project header */}
      <div
        style={{
          display:         "flex",
          justifyContent:  "space-between",
          alignItems:      "flex-start",
          marginBottom:    "40px",
          flexWrap:        "wrap",
          gap:             "16px",
        }}
      >
        <div style={{ display:"flex", alignItems:"baseline", gap:"20px" }}>
          <span
            style={{
              fontSize:    "clamp(48px, 8vw, 80px)",
              fontWeight:  700,
              color:       "var(--border2)",
              lineHeight:  1,
              letterSpacing:"-0.04em",
              userSelect:  "none",
            }}
          >
            {project.id}
          </span>
          <h2
            className="glitch"
            data-text={project.title}
            style={{
              fontSize:    "clamp(18px, 3vw, 28px)",
              fontWeight:  600,
              color:       "var(--bright)",
              letterSpacing:"-0.01em",
              lineHeight:  1.1,
            }}
          >
            {project.title}
          </h2>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"16px", flexShrink:0 }}>
          <span
            style={{
              fontSize:    "10px",
              fontWeight:  600,
              letterSpacing:"0.14em",
              color:       statusColor,
              border:      `1px solid ${statusColor}`,
              padding:     "4px 10px",
            }}
          >
            {project.status}
          </span>
          <span style={{ fontSize:"12px", color:"var(--muted)" }}>{project.year}</span>
        </div>
      </div>

      {/* Main body: video + info */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap:                 "32px",
          alignItems:          "start",
          direction:           flip ? "rtl" : "ltr",
        }}
      >
        {/* YouTube embed */}
        <div
          style={{
            direction:"ltr",
            position: "relative",
            aspectRatio:"16/9",
            border:   "1px solid var(--border2)",
            background:"var(--surface)",
            overflow: "hidden",
          }}
        >
          {/* Corner accents */}
          <div style={{
            position:"absolute", top:0, left:0,
            width:"16px", height:"16px",
            borderTop:"2px solid var(--green)", borderLeft:"2px solid var(--green)",
            zIndex:1, pointerEvents:"none",
          }} />
          <div style={{
            position:"absolute", bottom:0, right:0,
            width:"16px", height:"16px",
            borderBottom:"2px solid var(--green)", borderRight:"2px solid var(--green)",
            zIndex:1, pointerEvents:"none",
          }} />

          <iframe
            src={`https://www.youtube.com/embed/${project.videoId}?rel=0&modestbranding=1`}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width:   "100%",
              height:  "100%",
              border:  "none",
              display: "block",
              position:"absolute",
              inset:   0,
            }}
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div style={{ direction:"ltr" }}>
          {/* Description */}
          <p
            style={{
              fontSize:   "13px",
              color:      "var(--text)",
              lineHeight: "1.9",
              marginBottom:"24px",
            }}
          >
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics && (
            <div
              style={{
                padding:     "12px 16px",
                border:      "1px solid var(--border2)",
                background:  "var(--surface)",
                fontSize:    "12px",
                color:       "var(--green)",
                letterSpacing:"0.05em",
                marginBottom:"24px",
                fontWeight:  500,
              }}
            >
              <span style={{ color:"var(--dim)", marginRight:"8px" }}>METRICS</span>
              {project.metrics}
            </div>
          )}

          {/* Stack */}
          <div style={{ marginBottom:"24px" }}>
            <div style={{ fontSize:"10px", color:"var(--muted)", letterSpacing:"0.15em", marginBottom:"10px" }}>
              STACK
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {project.stack.map((s) => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS SECTION
   ============================================================ */

function Projects() {
  return (
    <section
      id="work"
      style={{
        padding:    "100px clamp(20px,4vw,60px)",
        borderTop:  "1px solid var(--border)",
      }}
    >
      <div className="section-label reveal" style={{ marginBottom:"20px" }}>
        <span>02 / WORK</span>
      </div>

      <div
        className="reveal"
        style={{
          fontSize:    "clamp(11px, 1.2vw, 12px)",
          color:       "var(--muted)",
          marginBottom:"8px",
          letterSpacing:"0.04em",
        }}
      >
        {/* Quick tip for the developer */}
        <span style={{ color:"var(--dim)" }}># Replace the videoId fields in PROJECTS[] at the top of page.tsx with your YouTube video IDs</span>
      </div>

      {PROJECTS.map((p, i) => (
        <ProjectCard key={p.id} project={p} flip={i % 2 === 1} />
      ))}
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */

function Contact() {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  const typeLines = useCallback((newLines: string[]) => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < newLines.length) {
        setLines((prev) => [...prev, newLines[i]]);
        i++;
      } else {
        clearInterval(iv);
      }
    }, 400);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setSubmitted(true);
    setLines([]);
    typeLines([
      `$ sendmail --to=${ME.email} --subject="${form.subject}"`,
      "> Connecting to SMTP... OK",
      "> Authenticating... OK",
      "> Building payload... OK",
      `> Delivering to ${ME.email}... OK`,
      "",
      "[SUCCESS] Message delivered. I will respond within 24h.",
    ]);
  };

  const inputStyle: React.CSSProperties = {
    width:        "100%",
    background:   "transparent",
    border:       "none",
    borderBottom: "1px solid var(--border2)",
    color:        "var(--bright)",
    fontSize:     "13px",
    padding:      "10px 0",
    fontFamily:   "inherit",
    outline:      "none",
    letterSpacing:"0.02em",
    transition:   "border-color 0.2s",
  };

  return (
    <section
      id="contact"
      style={{
        padding:   "100px clamp(20px,4vw,60px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="section-label reveal" style={{ marginBottom:"60px" }}>
        <span>03 / CONTACT</span>
      </div>

      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap:                 "clamp(40px,6vw,80px)",
          alignItems:          "start",
        }}
      >
        {/* Info */}
        <div className="reveal">
          <h2
            style={{
              fontSize:    "clamp(32px, 5vw, 56px)",
              fontWeight:  700,
              color:       "var(--bright)",
              lineHeight:  1.1,
              marginBottom:"28px",
              letterSpacing:"-0.02em",
            }}
          >
            LET&apos;S
            <br />
            <span style={{ color:"var(--green)" }} className="glow">BUILD.</span>
          </h2>
          <p
            style={{
              fontSize:  "13px",
              color:     "var(--text)",
              lineHeight:"1.9",
              marginBottom:"36px",
            }}
          >
            Looking to hire a backend engineer, collaborate on open source,
            or just talk distributed systems? My inbox is open.
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {[
              { label:"EMAIL",    val:ME.email    },
              { label:"GITHUB",   val:ME.github   },
              { label:"LINKEDIN", val:ME.linkedin },
            ].map((c) => (
              <div key={c.label} style={{ display:"flex", gap:"16px", fontSize:"12px" }}>
                <span style={{ color:"var(--muted)", minWidth:"80px", letterSpacing:"0.1em" }}>
                  {c.label}
                </span>
                <span style={{ color:"var(--text)" }}>{c.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form / terminal */}
        <div className="term-window reveal">
          <div className="term-bar">
            <div className="term-dot" />
            <div className="term-dot" />
            <div className="term-dot" />
            <span style={{ marginLeft:"4px" }}>send_message.sh</span>
          </div>
          <div style={{ padding:"20px 22px" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:"24px" }}>
                  <label style={{ display:"block", fontSize:"11px", color:"var(--dim)", letterSpacing:"0.1em", marginBottom:"8px" }}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend role at Acme Corp"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => { (e.target as HTMLElement).style.borderBottomColor = "var(--green)"; }}
                    onBlur={(e)  => { (e.target as HTMLElement).style.borderBottomColor = "var(--border2)"; }}
                    required
                  />
                </div>
                <div style={{ marginBottom:"28px" }}>
                  <label style={{ display:"block", fontSize:"11px", color:"var(--dim)", letterSpacing:"0.1em", marginBottom:"8px" }}>
                    MESSAGE
                  </label>
                  <textarea
                    placeholder="Tell me about the project..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={5}
                    style={{ ...inputStyle, resize:"vertical", borderBottom:"1px solid var(--border2)" }}
                    onFocus={(e) => { (e.target as HTMLElement).style.borderBottomColor = "var(--green)"; }}
                    onBlur={(e)  => { (e.target as HTMLElement).style.borderBottomColor = "var(--border2)"; }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width:         "100%",
                    padding:       "12px",
                    border:        "1px solid var(--green)",
                    background:    "transparent",
                    color:         "var(--green)",
                    fontSize:      "12px",
                    fontFamily:    "inherit",
                    fontWeight:    600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor:        "pointer",
                    transition:    "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--green)";
                    (e.currentTarget as HTMLElement).style.color      = "var(--bg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color      = "var(--green)";
                  }}
                >
                  ./send --encrypt
                </button>
              </form>
            ) : (
              <div style={{ fontSize:"12px", lineHeight:"2" }}>
                {lines.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      color: l.startsWith("[SUCCESS]")
                        ? "var(--green)"
                        : l.startsWith(">")
                        ? "var(--text)"
                        : l === ""
                        ? "transparent"
                        : "var(--dim)",
                    }}
                  >
                    {l || "\u00a0"}
                  </div>
                ))}
                {lines.length < 7 && <span className="cursor" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  const now = new Date();
  const processes = [
    { pid: "1337", name: "portfolio",       cpu: "0.0%", mem: "42.1 MB", status: "S" },
    { pid: "1338", name: "creativity",      cpu: "98.2%",mem: "∞",       status: "R" },
    { pid: "1339", name: "coffee_daemon",   cpu: "0.1%", mem: "2.0 MB",  status: "S" },
    { pid: "1340", name: "overthinking",    cpu: "12.4%",mem: "200 MB",  status: "R" },
    { pid: "1341", name: "side_projects",   cpu: "5.6%", mem: "64 MB",   status: "S" },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding:   "40px clamp(20px,4vw,60px) 32px",
      }}
    >
      {/* Process table */}
      <div style={{ marginBottom:"32px", overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px", minWidth:"400px" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--border2)" }}>
              {["PID", "NAME", "CPU", "MEM", "STATUS"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign:   "left",
                    padding:     "8px 16px 8px 0",
                    color:       "var(--dim)",
                    letterSpacing:"0.12em",
                    fontWeight:  500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"7px 16px 7px 0", color:"var(--muted)" }}>{p.pid}</td>
                <td style={{ padding:"7px 16px 7px 0", color:"var(--text)" }}>{p.name}</td>
                <td style={{ padding:"7px 16px 7px 0", color:"var(--text)" }}>{p.cpu}</td>
                <td style={{ padding:"7px 16px 7px 0", color:"var(--text)" }}>{p.mem}</td>
                <td style={{ padding:"7px 16px 7px 0" }}>
                  <span
                    style={{
                      color:      p.status === "R" ? "var(--green)" : "var(--dim)",
                      fontWeight: p.status === "R" ? 600 : 400,
                    }}
                  >
                    {p.status === "R" ? "● RUNNING" : "● SLEEPING"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          flexWrap:       "wrap",
          gap:            "12px",
          fontSize:       "11px",
          color:          "var(--muted)",
        }}
      >
        <span>© {now.getFullYear()} {ME.name} — All rights reserved.</span>
        <span style={{ letterSpacing:"0.08em" }}>
          BUILT WITH{" "}
          <span style={{ color:"var(--dim)" }}>NEXT.JS + TAILWIND</span>
          {"  //  "}
          NO TEMPLATES HARMED
        </span>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE ROOT
   ============================================================ */

export default function Home() {
  useReveal();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />

      {/* Mobile nav note — minimal inline style */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
        @media (max-width: 600px) {
          table { font-size: 10px !important; }
        }
      `}</style>
    </>
  );
}

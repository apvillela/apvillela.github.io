"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ============================================================
   DATA
   ============================================================ */

type Lang  = "en" | "pt";
type Theme = "light" | "dark";
type T<X>  = Record<Lang, X>;

const ME = {
  handle:   "apvillela",
  name:     "Alexandre Villela",
  email:    "ap.villela10@gmail.com",
  github:   "github.com/apvillela",
  linkedin: "linkedin.com/in/alexandre-pereira-villela",
};

interface Shot {
  src:     string;
  label:   T<string>;   // short name, the thing this shot proves
  caption: T<string>;
  width:   number;
  height:  number;
}

/* A project shows a walkthrough video, a set of stills, or nothing yet. */
type Media =
  | { kind: "video"; videoId: string }
  | { kind: "shots"; shots: Shot[] }
  | { kind: "none" };

interface ProjectLink {
  kind: "SRC" | "LIVE";
  href: string;
}

interface Project {
  id:       string;
  title:    string;
  summary:  T<string>;     // one line: what it is, for whom
  notes:    T<string[]>;   // the engineering decisions, drawing-notes style
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
    summary: {
      en: "Conversational agent that reads Brazilian public-education editais and answers over WhatsApp and Telegram; every answer names the document and section it came from.",
      pt: "Agente conversacional que lê editais de educação pública e responde pelo WhatsApp e Telegram; toda resposta indica o documento e a seção de onde veio.",
    },
    notes: {
      en: [
        "Out-of-corpus questions get a refusal and the institution's official channel, never a guess. The demo wall logs every turn as cited or refused.",
        "24 editais, 265 openings and 69 campuses indexed in Postgres with pgvector and PostGIS; recommendations weigh travel distance against the enrolment calendar.",
        "Voice notes in Portuguese, Spanish or Haitian Creole are answered in the language they were spoken.",
      ],
      pt: [
        "Perguntas fora do acervo recebem uma recusa e o canal oficial da instituição, nunca um chute. O painel da demo registra cada turno como citado ou recusado.",
        "24 editais, 265 vagas e 69 campi indexados no Postgres com pgvector e PostGIS; as recomendações pesam a distância de deslocamento contra o calendário de matrícula.",
        "Áudios em português, espanhol ou crioulo haitiano são respondidos no idioma em que foram falados.",
      ],
    },
    tools:   ["Google ADK", "Gemini", "PostgreSQL", "FastAPI"],
    media: {
      kind: "shots",
      shots: [
        {
          src:     "/shots/decifra-cited.webp",
          label:   { en: "Cited", pt: "Citado" },
          caption: {
            en: "A course question answered from the corpus: the reply names Edital 05/DEING/2024/1 and the annex it read.",
            pt: "Pergunta sobre um curso respondida pelo acervo: a resposta cita o Edital 05/DEING/2024/1 e o anexo consultado.",
          },
          width:   1280,
          height:  720,
        },
        {
          src:     "/shots/decifra-refused.webp",
          label:   { en: "Refused", pt: "Recusado" },
          caption: {
            en: "Asked for a medical course the corpus does not hold, the agent declines and forwards the institution's own portal.",
            pt: "Perguntado sobre um curso de medicina que o acervo não tem, o agente recusa e encaminha para o portal da própria instituição.",
          },
          width:   1280,
          height:  720,
        },
        {
          src:     "/shots/decifra-panel.webp",
          label:   { en: "Provenance", pt: "Procedência" },
          caption: {
            en: "Live wall for the demo: every turn lands here as answered-with-citation or refused, read straight off the answer log.",
            pt: "Painel ao vivo da demo: cada turno chega aqui como respondido com citação ou recusado, lido direto do log de respostas.",
          },
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
    summary: {
      en: "Community platform for Catholic parishes: members post from a Mass, a rosary or a study group, and the feed threads it all inside the right community.",
      pt: "Plataforma de comunidade para paróquias católicas: membros postam de uma missa, um terço ou um grupo de estudo, e o feed organiza tudo dentro da comunidade certa.",
    },
    notes: {
      en: [
        "Feeds stay live through Firestore listeners, not polling; Cloud Functions carry fan-out and notifications.",
        "Security rules scope every read to the communities a member actually joined.",
        "Write paths pass through Upstash rate limiting before they touch Firestore.",
      ],
      pt: [
        "Os feeds ficam ao vivo com listeners do Firestore, sem polling; Cloud Functions cuidam do fan-out e das notificações.",
        "Regras de segurança limitam cada leitura às comunidades em que o membro de fato entrou.",
        "Escritas passam por rate limiting no Upstash antes de tocar o Firestore.",
      ],
    },
    tools:   ["Next.js", "Firebase", "Cloud Functions", "Upstash Redis"],
    links:   [{ kind: "LIVE", href: "https://halos.com.br" }],
    media: {
      kind: "shots",
      shots: [
        {
          src:     "/shots/halos-feed.webp",
          label:   { en: "Feed", pt: "Feed" },
          caption: {
            en: "A member's home feed: the community they belong to, then posts from Mass and the rosary with reactions threaded underneath.",
            pt: "O feed inicial de um membro: a comunidade a que pertence, depois posts da missa e do terço com as reações logo abaixo.",
          },
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
    summary: {
      en: "Serverless lead-enrichment pipeline on AWS: an LLM agent gathers the evidence, a deterministic scorer sets the number.",
      pt: "Pipeline serverless de enriquecimento de leads na AWS: um agente de LLM reúne as evidências, um scorer determinístico define a nota.",
    },
    notes: {
      en: [
        "The model supplies reasoning, never the score: a ReAct agent pulls comparable accounts from Pinecone and hands them to deterministic scoring.",
        "Validate → SQS → enrich, with DynamoDB streams carrying results on to BigQuery for the funnel view. The whole stack is declared in AWS SAM.",
      ],
      pt: [
        "O modelo fornece o raciocínio, nunca a nota: um agente ReAct busca contas comparáveis no Pinecone e as entrega ao scoring determinístico.",
        "Validar → SQS → enriquecer, com DynamoDB Streams levando os resultados ao BigQuery para a visão de funil. A stack inteira é declarada em AWS SAM.",
      ],
    },
    tools:   ["AWS Lambda", "SQS", "LangChain", "Pinecone"],
    links:   [{ kind: "SRC", href: "https://github.com/apvillela/aws-ai-agent" }],
    media:   { kind: "none" },
    year:    "2026",
  },
  {
    id:      "04",
    title:   "Promo Bot",
    summary: {
      en: "Always-on watcher over four high-end storefronts, fanning sales out to two Telegram channels.",
      pt: "Monitor sempre ligado sobre quatro lojas de alto padrão, distribuindo promoções para dois canais do Telegram.",
    },
    notes: {
      en: [
        "Notifications leave through a Redis Streams consumer group: a process that dies mid-send redelivers on the next boot instead of losing the promo.",
        "One adapter per storefront normalises the payload, so a retailer reshaping its JSON is a one-file fix that never reaches filtering, dedupe or notify.",
        "Every watch tracks its own health: a source that starts failing says so instead of going quietly silent.",
      ],
      pt: [
        "As notificações saem por um consumer group do Redis Streams: um processo que morre no meio do envio reentrega no próximo boot em vez de perder a promoção.",
        "Um adapter por loja normaliza o payload, então uma loja que muda o JSON vira correção de um arquivo só, que nunca chega a filtro, dedupe ou envio.",
        "Cada monitor acompanha a própria saúde: uma fonte que começa a falhar avisa, em vez de ficar em silêncio.",
      ],
    },
    tools:   ["Python", "Redis Streams", "SQLite", "Docker"],
    media:   { kind: "none" },
    status:  "PRODUCTION",
    year:    "2026",
  },
];

const ABOUT: T<string[]> = {
  en: [
    "Backend engineer working across async pipelines, serverless infrastructure and LLM agents in production.",
    "The common thread is designing around failure: messages that redeliver instead of vanish, agents that cite or refuse instead of guess, sources that report their own degradation.",
  ],
  pt: [
    "Engenheiro backend trabalhando com pipelines assíncronos, infraestrutura serverless e agentes de LLM em produção.",
    "O fio condutor é projetar em torno da falha: mensagens que são reentregues em vez de sumir, agentes que citam ou recusam em vez de chutar, fontes que reportam a própria degradação.",
  ],
};

const UI = {
  en: {
    identity: "Identity", work: "Shipped work", contact: "Contact",
    navIdentity: "IDENTITY", navWork: "WORK", navContact: "CONTACT",
    role: "ROLE", roleValue: "Backend Engineer", maintainer: "MAINTAINER",
    notes: "NOTES", plate: "PL.", shots: "screenshots", engNotes: "engineering notes",
    links: { SRC: "SRC", LIVE: "LIVE" },
    status: { PRODUCTION: "PRODUCTION", "OPEN SOURCE": "OPEN SOURCE", ARCHIVED: "ARCHIVED", WIP: "WIP" },
    enlarge: "Enlarge screenshot", close: "Close", pan: "Drag to pan",
    language: "Language", theme: "Theme", light: "Paper", dark: "Blueprint",
  },
  pt: {
    identity: "Identidade", work: "Trabalho entregue", contact: "Contato",
    navIdentity: "IDENTIDADE", navWork: "TRABALHO", navContact: "CONTATO",
    role: "CARGO", roleValue: "Engenheiro Backend", maintainer: "MANTENEDOR",
    notes: "NOTAS", plate: "PR.", shots: "capturas de tela", engNotes: "notas de engenharia",
    links: { SRC: "CÓDIGO", LIVE: "NO AR" },
    status: { PRODUCTION: "EM PRODUÇÃO", "OPEN SOURCE": "OPEN SOURCE", ARCHIVED: "ARQUIVADO", WIP: "EM ANDAMENTO" },
    enlarge: "Ampliar captura", close: "Fechar", pan: "Arraste para mover",
    language: "Idioma", theme: "Tema", light: "Papel", dark: "Planta",
  },
};

type Copy = (typeof UI)["en"];

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

/* Which section sits under the reading line, for the mobile index strip. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function store(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {}
  return null;
}

/* The inline script in layout.tsx already put the stored/system choice on
   <html> before paint; this just mirrors it into React and persists changes. */
function usePrefs() {
  const [lang, setLang]   = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");

  // read after mount on purpose: the static HTML is always EN/light, so reading
  // storage during render would break hydration
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (store("lang") === "pt") setLang("pt");
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  return {
    lang,
    theme,
    pickLang: (l: Lang) => { setLang(l); store("lang", l); },
    pickTheme: (t: Theme) => {
      setTheme(t);
      store("theme", t);
      document.documentElement.dataset.theme = t;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#0F1D36" : "#E9E7E0");
    },
  };
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
function Shots({ shots, title, lang, t }: { shots: Shot[]; title: string; lang: Lang; t: Copy }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const shot = shots[active];

  // a horizontal swipe on the plate turns to the neighbouring one
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setActive((i) => Math.min(shots.length - 1, Math.max(0, i + (dx < 0 ? 1 : -1))));
  };

  return (
    <div className="spec-shots">
      {shots.length > 1 && (
        <div className="spec-shot-tabs" role="group" aria-label={`${title}: ${t.shots}`}>
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className="spec-shot-tab"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <span className="spec-shot-tab-ref">{t.plate} {PLATE_LETTERS[i]}</span>
              <span className="spec-shot-tab-label">{s.label[lang]}</span>
            </button>
          ))}
        </div>
      )}

      <figure className="spec-plate">
        <div
          className="spec-plate-mount"
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={onTouchEnd}
        >
          <button type="button" className="spec-plate-zoom" aria-label={t.enlarge} onClick={() => setZoomed(true)}>
            <Image
              src={shot.src}
              alt={shot.caption[lang]}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 640px) 100vw, 1040px"
              className="spec-plate-img"
            />
          </button>
        </div>
        <figcaption className="spec-plate-cap">
          <span className="spec-plate-ref">{t.plate} {PLATE_LETTERS[active]}</span>
          {shot.caption[lang]}
        </figcaption>
      </figure>
      {zoomed && <Viewer shot={shot} lang={lang} t={t} onClose={() => setZoomed(false)} />}
    </div>
  );
}

/* Full-size plate on its own sheet. On a phone the landscape stills open at
   their real width so the UI text is readable, and the sheet pans. */
function Viewer({ shot, lang, t, onClose }: { shot: Shot; lang: Lang; t: Copy; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    const body = d.querySelector<HTMLElement>(".spec-viewer-body");
    if (body) body.scrollLeft = (body.scrollWidth - body.clientWidth) / 2;
  }, []);

  return (
    <dialog
      ref={ref}
      className="spec-viewer"
      aria-label={shot.caption[lang]}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div className="spec-viewer-bar">
        <span>{shot.label[lang]}</span>
        <span className="spec-viewer-hint">{t.pan}</span>
        <button type="button" onClick={() => ref.current?.close()}>{t.close} ✕</button>
      </div>
      <div className="spec-viewer-body">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.caption[lang]}
          width={shot.width}
          height={shot.height}
          style={{ "--w": `${shot.width}px` } as React.CSSProperties}
          className={shot.width > shot.height ? "is-wide" : undefined}
        />
      </div>
    </dialog>
  );
}

/* A lone portrait still is too narrow to carry the full column, so it runs
   beside the prose instead of stranding empty paper either side of it. */
function soloPortrait(project: Project): Shot | null {
  if (project.media.kind !== "shots" || project.media.shots.length !== 1) return null;
  const shot = project.media.shots[0];
  return shot.height > shot.width ? shot : null;
}

function BarePlate({ shot, lang }: { shot: Shot; lang: Lang }) {
  return (
    <div className="spec-plate spec-plate--bare">
      <div className="spec-plate-mount">
        <Image
          src={shot.src}
          alt={shot.caption[lang]}
          width={shot.width}
          height={shot.height}
          sizes="(max-width: 640px) 100vw, 320px"
          className="spec-plate-img"
        />
      </div>
    </div>
  );
}

function ProjectMedia({ project, lang, t }: { project: Project; lang: Lang; t: Copy }) {
  if (project.media.kind === "shots") {
    return <Shots shots={project.media.shots} title={project.title} lang={lang} t={t} />;
  }
  if (project.media.kind === "video") {
    return <YouTube videoId={project.media.videoId} title={project.title} />;
  }
  return null;
}

/* Two-position switch set like the meta grid: hairline box, active cell inked. */
function Switch<V extends string>({
  label, value, options, onPick,
}: {
  label: string;
  value: V;
  options: { value: V; text: React.ReactNode; title?: string }[];
  onPick: (v: V) => void;
}) {
  return (
    <div className="spec-switch" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          aria-label={o.title}
          title={o.title}
          onClick={() => onPick(o.value)}
        >
          {o.text}
        </button>
      ))}
    </div>
  );
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

const SECTION_IDS = ["identity", "work", "contact"];

export default function Home() {
  useReveal();
  const { lang, theme, pickLang, pickTheme } = usePrefs();
  const t = UI[lang];
  const active = useActiveSection(SECTION_IDS);
  const sections = [
    { id: "identity", num: "§1", label: t.navIdentity },
    { id: "work",     num: "§2", label: t.navWork },
    { id: "contact",  num: "§3", label: t.navContact },
  ];

  return (
    <div className="theme-spec">
      <nav className="spec-nav">
        <div className="spec-nav-inner">
          <span style={{ fontWeight: 700 }}>APV/PORTFOLIO</span>
          <div className="spec-nav-links">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
                {s.num} {s.label}
              </a>
            ))}
          </div>
          <div className="spec-nav-controls">
            <Switch
              label={t.language}
              value={lang}
              onPick={pickLang}
              options={[
                { value: "en", text: "EN", title: "English" },
                { value: "pt", text: "PT", title: "Português (Brasil)" },
              ]}
            />
            <Switch
              label={t.theme}
              value={theme}
              onPick={pickTheme}
              options={[
                { value: "light", text: <span className="spec-swatch spec-swatch--light" />, title: t.light },
                { value: "dark",  text: <span className="spec-swatch spec-swatch--dark" />,  title: t.dark },
              ]}
            />
          </div>
        </div>
        <div className="spec-nav-index">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
              <span>{s.num}</span> {s.label}
            </a>
          ))}
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
                <dt>{t.role}</dt>
                <dd>{t.roleValue}</dd>
              </div>
              <div>
                <dt>{t.maintainer}</dt>
                <dd>{ME.handle}</dd>
              </div>
            </dl>
          </div>
        </header>

        {/* §1 Identity */}
        <section id="identity" className="spec-sec">
          <div className="spec-sec-head reveal">
            <span className="spec-sec-num">§1</span>
            <h2 className="spec-sec-title">{t.identity}</h2>
          </div>
          {ABOUT[lang].map((line, i) => (
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
            <h2 className="spec-sec-title">{t.work}</h2>
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
                      {t.status[p.status]}
                    </span>
                  )}
                  {p.links?.map((l) => (
                    <a key={l.href} className="spec-fig-link" href={l.href} target="_blank" rel="noreferrer">
                      {t.links[l.kind]} ↗
                    </a>
                  ))}
                  <span className="spec-fig-year">{p.year}</span>
                </figcaption>
                <div className="spec-fig-body">
                  {solo ? <BarePlate shot={solo} lang={lang} /> : <ProjectMedia project={p} lang={lang} t={t} />}
                  <div>
                    {solo && <p className="spec-plate-note">{solo.caption[lang]}</p>}
                    <p className="spec-fig-desc">{p.summary[lang]}</p>
                    <ol className="spec-notes" data-label={t.notes} aria-label={`${p.title}: ${t.engNotes}`}>
                      {p.notes[lang].map((n, i) => (
                        <li key={i}>
                          <span className="spec-note-num">{i + 1}.</span>
                          {n}
                        </li>
                      ))}
                    </ol>
                    <ul className="spec-tools">
                      {p.tools.map((tool) => (
                        <li key={tool} className="spec-tool">{tool}</li>
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
            <h2 className="spec-sec-title">{t.contact}</h2>
          </div>
          <div className="reveal">
            {[
              { label: "EMAIL",    href: `mailto:${ME.email}`,        text: ME.email    },
              { label: "GITHUB",   href: `https://${ME.github}`,      text: ME.github   },
              { label: "LINKEDIN", href: `https://${ME.linkedin}`,    text: ME.linkedin },
            ].map((ref, i) => (
              <a
                key={ref.label}
                className="spec-ref"
                href={ref.href}
                target={ref.label === "EMAIL" ? undefined : "_blank"}
                rel="noreferrer"
              >
                <span className="spec-ref-num">[{i + 1}]</span>
                <span className="spec-ref-label">{ref.label}</span>
                {/* break long handles at their slashes, never mid-word */}
                <span className="spec-ref-value">
                  {ref.text.split("/").map((part, j) => (
                    <span key={j}>{j > 0 && <>/<wbr /></>}{part}</span>
                  ))}
                </span>
              </a>
            ))}
          </div>
        </section>

        <footer className="spec-footer">APV/PORTFOLIO · REV. 2026.10</footer>
      </div>
    </div>
  );
}

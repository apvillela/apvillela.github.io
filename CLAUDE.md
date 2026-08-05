# Backend Portfolio — Claude Reference

Personal portfolio website for Alexandre Villela (handle: `apvillela`). Brutalist-adjacent aesthetic. Focused on backend engineering identity. Embeds YouTube videos of portfolio projects.

## Stack

| | |
|---|---|
| Framework | Next.js (TypeScript) |
| Styling | Tailwind CSS + PostCSS |
| Content | Static — no CMS |
| Hosting | TBD (static export or Vercel) |

## Key Rules

- **Name**: always `Alexandre Villela` (display) and `apvillela` (handle/username). Never use any other name.
- **Aesthetic**: brutalist-leaning, backend-centric, not corporate. It should read as "backend engineer" immediately.
- **YouTube embeds**: portfolio project videos are embedded directly on the page — don't replace with thumbnails.
- **Mobile**: must be as strong as desktop. The hero section is the most mobile-sensitive area.

## File Structure

```
backend-portfolio/
├── src/           # Next.js app
├── public/        # Static assets
├── next.config.ts
├── tailwind.config (via postcss)
└── package.json
```

## Common Tasks

| Task | Command |
|---|---|
| Dev server | `cd backend-portfolio && npm run dev` |
| Build | `cd backend-portfolio && npm run build` |
| Lint | `cd backend-portfolio && npm run lint` |

## Design Constraints
- When doing UI work, use the `ui-overhaul` skill or `frontend-design` skill
- Mobile hero is the most-complained-about area — always check it at 375px
- Avoid anything that looks like a generic developer portfolio template

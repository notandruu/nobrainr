# nobrainr

Find the best gaming products without spending hours reading Reddit threads. An AI agent scrapes and analyzes millions of Reddit comments, extracts consensus picks, and surfaces the highest rated gear with concise takeaways in seconds. Updated daily with 10M+ comments processed.

## Features

- **Instant search** - type any gaming category and get AI-ranked results in seconds
- **Reddit-sourced** - millions of comments analyzed across r/gaming, r/Headphones, r/BudgetAudiophile, r/MechanicalKeyboards, and more
- **Consensus extraction** - AI identifies what the community actually agrees on, not just what is upvoted once
- **Concise takeaways** - each pick comes with a summary of why Reddit recommends it over alternatives
- **Daily updates** - 10M+ comments processed and re-ranked every day
- **Direct links** - each result links straight to Amazon with affiliate disclosure

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + shadcn/ui + Radix UI |
| Styling | Tailwind CSS v3 |
| Language | TypeScript |
| AI | Gemini 2.0 Flash via Google Generative AI API |
| Animations | Framer Motion |

## Getting Started

```bash
pnpm install
pnpm dev
```

Set your Gemini API key:

```bash
cp .env.example .env.local
# add your GEMINI_API_KEY to .env.local
```

Open [http://localhost:3000](http://localhost:3000).

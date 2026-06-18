# Aria — Invest smarter, not faster

> An AI investing **co-pilot** for the next generation of investors. Most apps make you trade faster. **Aria makes you a better investor.**

🔗 **Live prototype:** _add your Vercel link here after deploying_

---

## The problem

Gamified trading apps have made it frictionless for young investors to buy and sell —
and that's exactly the problem. The #1 reason new investors lose money isn't a bad app;
it's **impulsive, emotional decisions** made without understanding.

Every team builds another Robinhood clone with a chatbot bolted on as a sixth tab.
Aria does the opposite: the AI is **woven through every screen**, and the whole experience
is designed to build conviction and understanding, not dopamine.

## The 3 things that make Aria different

1. **🛡️ Conviction Check** — Before *any* trade executes, Aria surfaces the real risks,
   runs a "what could go wrong" simulation (e.g. *"if this dropped 25%, your position
   would be worth $X — could you hold?"*), and asks you to state your thesis in one line.
   Thoughtful trades sail through; impulsive ones get a calmer alternative. **A behavioral
   guardrail no other trading app has.**

2. **💬 Plain-English investing** — Tell Aria *"I have $500 and want safe long-term growth"*
   and it builds a diversified basket with plain-language reasons — then sets up the trades.
   The AI assistant is the *core interaction*, not an afterthought.

3. **⚡ Contextual micro-lessons** — Tap any unfamiliar term (P/E ratio, diversification,
   risk) anywhere in the app and get a 30-second explainer in place. Learning happens at
   the moment of curiosity, not in a dead course tab.

## All six required screens

| Screen | What's inside |
| --- | --- |
| **Home Dashboard** | Portfolio value & day change, performance ring, watchlist, market summary, Aria's *Insight of the day*, personalized picks |
| **Discover** | Search + filter (stocks / ETFs / crypto / mutual funds), trending, curated collections, asset detail with plain-language summaries |
| **Trading** | Buy/sell with clear **risk indicators** and the **Conviction Check** gate |
| **Portfolio** | Holdings, allocation donut, **diversification & risk scores**, long-term goal progress |
| **Learn & Invest** | Bite-size lessons, beginner path, market explainers, Aria-recommended next lesson |
| **AI Assistant (Aria)** | Full chat + the co-pilot surfacing inline across every screen |

## The AI engine (hybrid, demo-safe)

Aria runs on the **Claude API** when a key is provided, and falls back to a high-quality
**scripted engine** otherwise — so a live demo *never* fails on stage.

```bash
cp .env.example .env.local   # then add your key (optional)
# VITE_ANTHROPIC_API_KEY=sk-ant-...
# VITE_ANTHROPIC_MODEL=claude-haiku-4-5
```

Without a key the app is fully functional in **Demo mode** (offline scripted answers for
the key flows: build-a-basket, explain-an-asset, calm-me-down).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173  (view in a mobile viewport ~390px)
npm run build    # production build
```

## Tech

React + TypeScript · Vite · Tailwind CSS · Zustand (live portfolio state) · Framer Motion ·
SVG charts (no chart library) · Claude API.

## The 90-second demo

1. Open the dashboard → tap **Aria's Insight of the day**.
2. Ask Aria: *"I have $500 and want safe long-term growth"* → it proposes a basket with reasons.
3. Go buy a hot, volatile asset → the **Conviction Check** shows the downside and asks for your thesis. *(The moment that wins.)*
4. Confirm a sensible trade → watch the **Portfolio & Dashboard update live**.
5. On an asset page, tap **"P/E ratio"** → a contextual micro-lesson pops in.

> *"Most apps make you trade faster. Aria makes you invest smarter."*

---

⚠️ Prototype for a hackathon. Mock market data; not financial advice.

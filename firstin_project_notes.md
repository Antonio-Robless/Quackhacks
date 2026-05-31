# FirstIn — Project Notes (QuackHacks)

## The Idea

**"The older sibling first-gen students never had."**

An AI-powered college navigator built *specifically* for first-generation college students — people whose parents never went to college and who have no family roadmap to rely on.

The core insight: the problem was never a lack of information. It was that everything assumed prior knowledge that first-gen students simply don't have. **FirstIn is a translator.**

---

## The Problem It Solves

### Hidden Curriculum
- Not knowing to go to office hours
- Not knowing deadlines for declaring a major
- Not knowing unpaid internships are how people get jobs
- Not knowing a professor's rec letter can change your life

### Financial Confusion
- FAFSA is confusing without guidance
- Financial aid letters are written in jargon
- Student debt decisions made without context
- Can't take unpaid internships due to immediate financial need

> *(Imposter syndrome and family guilt were intentionally scoped out — emotional/psychological problems AI shouldn't try to fix.)*

---

## What Makes It Different From ChatGPT

| Generic AI Chatbot | FirstIn |
|---|---|
| Blank text box | Onboarding that knows who you are |
| Generic responses | Tuned for first-gen experience |
| Reactive only | Proactively surfaces what you didn't know to ask |
| Looks like ChatGPT | Feels like it was built for you |

**Never assumes prior knowledge. Explains the *why*, not just the what.**

---

## Example Interactions It Should Handle

- *"I got my financial aid letter and I don't understand it"* → Plain English breakdown, like an older sibling explaining it
- *"I'm a senior first-gen and have no idea what to do"* → Asks the right follow-up: jobs? grad school? surviving financially? Then goes deep.

---

## Tech Stack (All 4 Hackathon Tracks)

| Tool | Role |
|---|---|
| **Base44** | Build the full app — onboarding flow + chat interface |
| **Google Gemini** | Power the AI brain via API |
| **Snowflake** | Log anonymized questions; display a "most common confusions" dashboard |
| **Digital Ocean** | Host and deploy the app |

Using all four tracks is a judging advantage — and each one earns its place.

---

## Build Order

1. Write the Gemini system prompt (the "older sibling" voice — this is the heart)
2. Build onboarding flow in Base44 (year in school, what's on your mind)
3. Connect chat interface
4. Set up Snowflake logging
5. Deploy to Digital Ocean
6. Polish UI/UX

---

## QuackHacks Judging Criteria

| Criteria | Assessment |
|---|---|
| **Innovation** | ✅ Strong — onboarding + insights dashboard make it feel intentional |
| **Technical Execution** | ✅ Strong — 4 sponsor tracks used meaningfully |
| **Design & UX** | ⚠️ Biggest risk — can't look like a generic text box |
| **Presentation** | ✅ Strongest card — "I built this because I lived this" |

**Priority:** Invest in UX. The onboarding screen and visual design need to feel warm and intentional — made for a stressed 19-year-old, not a SaaS product.

---

## The Pitch

> *"First-gen students are navigating college completely alone, with no family roadmap. We built the older sibling they never had."*

Opening line:
> *"I'm a first-gen student. I had nobody to explain any of this to me — so I built the tool I wish I'd had."*

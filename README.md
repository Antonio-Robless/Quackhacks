# FirstInLine 🎓

> The personal mentor first-gen college students never had.

Built for QuackHacks by a first-gen student, for first-gen students.

## Setup

### 1. Add your Gemini API Key
Open `src/api/gemini.js` and replace:
```
const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE'
```
Get a free key at: https://aistudio.google.com → Get API Key

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:5173

### 4. Build for production
```bash
npm run build
```
Deploy the `dist/` folder to Digital Ocean App Platform.

## Tech Stack
- React + Vite
- Tailwind CSS
- Google Gemini 2.5 Flash
- React Router

## Tracks
- Base44 — UI prototyping
- Google Gemini — AI brain
- Digital Ocean — hosting
- Snowflake — analytics (coming soon)

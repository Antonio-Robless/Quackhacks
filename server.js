import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import snowflake from 'snowflake-sdk'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
app.use(express.json())
 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT?.trim(),
  username: process.env.SNOWFLAKE_USER?.trim(),
  password: process.env.SNOWFLAKE_PASSWORD?.trim(),
  database: 'FIRSTINLINE',
  schema: 'PUBLIC',
  warehouse: 'COMPUTE_WH'
})

connection.connect((err) => {
  if (err) console.error('Snowflake connection failed:', err)
  else console.log('Snowflake connected')
})

function logQuestion(year, topics, message) {
  const category = detectCategory(message)
  connection.execute({
    sqlText: `INSERT INTO questions (year, topics, category, created_at) 
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    binds: [year, topics.join(','), category],
    complete: (err) => { if (err) console.error('Snowflake log error:', err) }
  })
}

function detectCategory(message) {
  const m = message.toLowerCase()
  if (m.includes('fafsa') || m.includes('financial aid')) return 'FAFSA & Financial Aid'
  if (m.includes('loan') || m.includes('debt')) return 'Student Debt'
  if (m.includes('intern') || m.includes('job') || m.includes('career')) return 'Career'
  if (m.includes('major') || m.includes('class') || m.includes('professor')) return 'Hidden Curriculum'
  if (m.includes('mental') || m.includes('tutor') || m.includes('resource')) return 'Campus Resources'
  return 'General'
}
 
function buildSystemPrompt(year, topics) {
  return `You are FirstInLine — an AI guide built specifically for first-generation college students. You were created by a first-gen student who had to figure everything out alone, and your entire purpose is to be the older sibling they never had.
 
WHO YOU'RE TALKING TO:
First-generation college students — meaning their parents did not attend college. They are navigating systems that everyone around them seems to already understand. They may feel overwhelmed, behind, or like they're missing something obvious. They are not. The system just wasn't built to explain itself to them.
 
The student is a ${year} who is most concerned about: ${topics && topics.length > 0 ? topics.join(', ') : 'general college guidance'}.
 
HOW YOU SPEAK:
- Warm, direct, and human. Like a trusted older sibling or mentor who has been through it.
- Never condescending. Never clinical.
- Plain language always. If you must use a term like "EFC" or "subsidized loan," immediately explain what it means in one simple sentence.
- Never assume they know something just because it seems obvious. Nothing is obvious when you're the first.
- Keep responses focused and digestible. No overwhelming walls of text. If something is complex, break it into small steps.
- Always acknowledge the emotional weight when relevant. College is stressful. Being first-gen is isolating. Name that when it comes up.
- Your mission is to guide them and help them learn. Give them foundation and structure.
 
WHAT YOU HELP WITH:
- FAFSA: How to fill it out, what the questions mean, what to do if their parents are undocumented, what happens after they submit
- Financial Aid: How to read an award letter, difference between grants and loans, how to appeal a financial aid decision
- Student Debt: What subsidized vs unsubsidized means, how interest works, what repayment options exist, income-driven repayment
- Hidden Curriculum: Office hours (what they are and why they matter), how to email a professor, how to declare a major, academic probation, GPA, credit hours, prerequisites
- Campus Resources: How to find tutoring, mental health counseling, food pantries, work-study, emergency funds — and that it's okay to use them
- Career Development: Internships, how to get one without connections, LinkedIn, resume basics, what to do when you have no network, how to progress career even though they currently have part-time job
- General "I don't know what I'm doing": When a student says something vague like "I'm a senior and have no idea what to do" — ask 2-3 focused clarifying questions to understand what they actually need, then guide them step by step
- Life: Financial questions (budgeting, stocks, loans, etc.), habit building, quality of life
 
WHAT YOU ALWAYS DO:
- If a question is vague, ask one focused clarifying question before answering. Don't overwhelm them with multiple questions at once.
- When explaining a process, break it into numbered steps.
- When relevant, remind them that not knowing this stuff is not their fault — the system assumes knowledge they were never given.
- If they seem stressed or overwhelmed, acknowledge it before diving into information.
- End responses with one clear next step they can take today, as well as a long term plan pertaining to their question.
- Format with Markdown: short **bold** lead-ins ("**Your next step:**"), bullet or numbered lists for steps, *italics* for soft emphasis, and ## headings when a reply has multiple sections. Never wrap the whole reply in a code block.
 
WHAT YOU NEVER DO:
- Never use jargon without immediately explaining it
- Never give a generic response that could apply to anyone — always make it feel personal to their situation
- Never make them feel stupid for not knowing something
- Never overwhelm them with every possible option — give them the most important thing first
- Never say "Great question!" or hollow filler phrases
- Never forget that behind every question is a real person trying to figure out something nobody taught them`
}
 
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, year, topics } = req.body
    const messages = (history || []).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))
    messages.push({ role: 'user', parts: [{ text: message }] })

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(year, topics) }] },
          contents: messages,
          tools: [{ google_search: {} }]
        })
      }
    )

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    const candidate = data.candidates?.[0]
    if (!candidate) throw new Error('No response from Gemini')

    const parts = candidate?.content?.parts || []
    const reply = parts.find(p => p.text)?.text || "I'm having trouble responding right now."

    const usedSearch = candidate?.groundingMetadata?.webSearchQueries?.length > 0
    const searchQueries = candidate?.groundingMetadata?.webSearchQueries || []
    const sources = candidate?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk?.web?.uri)
      .filter(Boolean) || []

    logQuestion(year, topics || [], message)
    res.json({ reply, usedSearch, searchQueries, sources })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/insights', (req, res) => {
  connection.execute({
    sqlText: `SELECT category, COUNT(*) as count 
              FROM questions 
              GROUP BY category 
              ORDER BY count DESC`,
    complete: (err, stmt, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    }
  })
})

app.get('/api/insights/years', (req, res) => {
  connection.execute({
    sqlText: `SELECT year, COUNT(*) as count 
              FROM questions 
              GROUP BY year 
              ORDER BY count DESC`,
    complete: (err, stmt, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    }
  })
})

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FirstInLine server running at http://localhost:${PORT}`)
})
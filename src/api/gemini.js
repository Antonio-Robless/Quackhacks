const SERVER_URL = 'http://localhost:3001'

export async function sendToGemini(userMessage, history, year, topics) {
  const res = await fetch(`${SERVER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, history, year, topics })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return {
    reply: data.reply,
    usedSearch: data.usedSearch || false,
    searchQueries: data.searchQueries || [],
    sources: data.sources || []
  }
}

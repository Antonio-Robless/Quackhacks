import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendToGemini } from '../api/gemini'
import { StudentProfile } from '../lib/studentProfile'
import { useSkyStage } from '../lib/skyStage'
import { IconMentor, IconInsights, IconMoney, IconBook, IconBriefcase, GradStudentI } from '../components/icons'

const SUGGESTIONS = [
  { Icon: IconMoney,     text: 'Help with FAFSA' },
  { Icon: IconBook,      text: 'Study tips' },
  { Icon: IconBriefcase, text: 'Build my resume' },
  { Icon: IconMoney,     text: 'Find scholarships' },
]

const mdComponents = {
  h1: (props) => <h1 className="font-serif font-semibold text-maroon-900 text-xl mt-3 mb-2 first:mt-0" {...props} />,
  h2: (props) => <h2 className="font-serif font-semibold text-maroon-900 text-lg mt-3 mb-2 first:mt-0" {...props} />,
  h3: (props) => <h3 className="font-serif font-semibold text-maroon-900 text-base mt-3 mb-1.5 first:mt-0" {...props} />,
  p:  (props) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
  strong: (props) => <strong className="font-semibold text-maroon-900" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a:  (props) => <a className="text-brand-400 hover:text-brand-600 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
  code: (props) => <code className="bg-brand-50 text-maroon-700 px-1 py-0.5 rounded text-[0.85em] font-mono" {...props} />,
  blockquote: (props) => <blockquote className="border-l-2 border-brand-100 pl-3 italic text-maroon-600 my-2" {...props} />,
  hr: () => <hr className="border-beige-200 my-3" />,
  table: (props) => <table className="border-collapse my-2 text-xs" {...props} />,
  th: (props) => <th className="border border-beige-200 px-2 py-1 text-left font-semibold text-maroon-900" {...props} />,
  td: (props) => <td className="border border-beige-200 px-2 py-1" {...props} />,
}

const GREETINGS = {
  'Incoming Freshman': "Welcome! Starting college is huge — especially when you're figuring it out without a roadmap. That's exactly what I'm here for.",
  'Freshman': "First year is a lot. You're learning how everything works while also keeping up with classes. Let's make that easier.",
  'Sophomore': "Sophomore year is when things start to get real — you're past the newness but figuring out what actually matters. I've got you.",
  'Junior': "Junior year means internships, major decisions, and starting to think about what's next. Let's talk through it.",
  'Senior': "Senior year — you're almost there! Whether it's jobs, grad school, or just surviving the next few months, I'm here.",
}

function SearchIndicator({ queries, sources }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="mt-2 rounded-xl border border-brand-100 bg-brand-50 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-brand-100 transition-colors"
      >
        <span className="text-sm">🔍</span>
        <span className="text-xs font-medium text-brand-400 flex-1">Searched the web for current info</span>
        <span className="text-xs text-beige-400">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {queries.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-maroon-700 mb-1">Queries used:</p>
              <ul className="flex flex-col gap-0.5">
                {queries.map((q, i) => (
                  <li key={i} className="text-xs text-maroon-600 flex items-start gap-1">
                    <span className="text-beige-400 mt-0.5">›</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-maroon-700 mb-1">Sources:</p>
              <ul className="flex flex-col gap-0.5">
                {sources.slice(0, 4).map((url, i) => (
                  <li key={i} className="text-xs truncate">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-600 underline underline-offset-1"
                    >
                      {url.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Chat() {
  const navigate = useNavigate()
  const { setStage } = useSkyStage()
  const year = StudentProfile.getYear()
  const topics = StudentProfile.getTopics()
  const college = StudentProfile.getCollege()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const greeting = GREETINGS[year] || "Hey! I'm your FirstInLine mentor."
  const initialMessage = {
    role: 'ai',
    text: `Hey there.\n\n${greeting}\n\nI'm your FirstInLine mentor — think of me as the older sibling who went to college and figured things out so you don't have to. Ask me anything.`,
    usedSearch: false,
    searchQueries: [],
    sources: []
  }

  const [messages, setMessages] = useState([initialMessage])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    setStage('chat')
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setShowSuggestions(false)
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const { reply, usedSearch, searchQueries, sources } = await sendToGemini(msg, history, year, topics, college)
      setHistory(prev => [...prev, { role: 'user', text: msg }, { role: 'model', text: reply }])
      setMessages(prev => [...prev, { role: 'ai', text: reply, usedSearch, searchQueries, sources }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Something went wrong: ${e.message}.`,
        usedSearch: false,
        searchQueries: [],
        sources: []
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="chat-boot-header bg-beige-50 border-b border-beige-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-beige-400 hover:text-maroon-700 text-xl p-1 rounded-lg hover:bg-beige-50 transition-colors"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-400">
          <IconMentor className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-serif text-3xl font-semibold text-maroon-900">
            F<GradStudentI />rstInL<GradStudentI />ne Mentor
          </p>
          <p className="text-xs text-beige-400">Here for you, always</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <p className="text-2xl text-beige-400">{year}</p>
          <button
            onClick={() => navigate('/insights')}
            className="text-2xl text-brand-400 hover:text-brand-600 font-medium transition-colors flex items-center gap-2"
          >
            <IconInsights className="w-7 h-7" />
            Insights
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
              i === 0 ? 'chat-boot-greeting' : ''
            }`}
          >
            <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
              {msg.role === 'ai' && (
                <p className="text-xs text-beige-400 mb-1 pl-1">FirstInLine Mentor</p>
              )}
              <div className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-400 text-cream rounded-br-sm whitespace-pre-wrap'
                  : 'bg-beige-50 border border-beige-200 text-maroon-700 rounded-bl-sm'
              }`}>
                {msg.role === 'user'
                  ? msg.text
                  : <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{msg.text}</ReactMarkdown>
                }
              </div>

              {/* Search indicator — only on AI messages that used search */}
              {msg.role === 'ai' && msg.usedSearch && (
                <SearchIndicator queries={msg.searchQueries} sources={msg.sources} />
              )}
            </div>
          </div>
        ))}

        {/* Community card */}
        {showSuggestions && (
          <button
            onClick={() => navigate('/insights')}
            className="chat-boot-community group flex items-center gap-3 bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-400 rounded-2xl p-4 text-left transition-all mt-2"
          >
            <div className="w-11 h-11 rounded-full bg-cream flex items-center justify-center text-brand-400 flex-shrink-0">
              <IconInsights className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-maroon-900 mb-0.5">You're not alone in this.</p>
              <p className="text-xs text-maroon-700">Here's what other first-gen students are asking about</p>
            </div>
            <span className="text-brand-400 text-lg group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
          </button>
        )}

        {/* Suggestion chips */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-1">
            {SUGGESTIONS.map(({ Icon, text }, i) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                style={{ animationDelay: `${1300 + i * 80}ms` }}
                className="chat-boot-chip bg-brand-50 border border-brand-100 hover:border-brand-400 hover:bg-brand-100 hover:text-brand-600 text-maroon-700 text-xs font-medium px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5" />
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-beige-50 border border-beige-200 rounded-2xl rounded-bl-sm px-4 py-3.5">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-beige-400 rounded-full typing-dot" />
                <span className="w-2 h-2 bg-beige-400 rounded-full typing-dot" />
                <span className="w-2 h-2 bg-beige-400 rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-boot-input bg-beige-50 border-t border-beige-200 px-4 py-4">
        <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-full px-5 py-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-sm text-maroon-800 placeholder-beige-400"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-brand-400 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-cream w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors flex-shrink-0"
          >
            →
          </button>
        </div>
        <p className="text-center text-xs text-beige-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

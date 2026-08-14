import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  "What's her IAM experience?",
  'What projects has she shipped?',
  'What tech stack does she use?',
  'Is she open to full-time roles?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')
    const userMsg: Message = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) throw new Error('Request failed')

      // Stream SSE
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages([...history, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const token = parsed.delta?.text ?? parsed.text ?? ''
            assistantText += token
            setMessages([...history, { role: 'assistant', content: assistantText }])
          } catch {}
        }
      }
    } catch {
      setError('> connection interrupted — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-cyan text-ink rounded-full flex items-center justify-center shadow-lg hover:bg-cyan/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan border-glow">
        <span className="font-mono text-lg">{open ? '×' : '?'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Chat with Manahil's assistant"
            aria-modal="true"
            className="fixed bottom-20 right-6 z-50 w-80 md:w-96 bg-panel border border-line rounded-xl shadow-2xl flex flex-col overflow-hidden border-glow"
            style={{ maxHeight: '70vh' }}>

            {/* Header */}
            <div className="px-4 py-3 border-b border-line bg-panel2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span className="font-mono text-xs text-cyan tracking-widest">ASK ABOUT MANAHIL</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <p className="font-mono text-xs text-muted text-center py-4">
                  &gt; Ask me anything about Manahil's background.
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 font-mono text-xs leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-cyanDim/30 border border-cyanDim text-text'
                      : 'bg-panel2 border border-line text-muted'}`}>
                    {m.role === 'assistant' && <span className="text-cyan mr-1">&gt;</span>}
                    {m.content || (loading && i === messages.length - 1 ? '▋' : '')}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-panel2 border border-line rounded-lg px-3 py-2 font-mono text-xs text-muted">
                    <span className="text-cyan">&gt;</span> <span className="animate-pulse">processing...</span>
                  </div>
                </div>
              )}
              {error && (
                <p className="font-mono text-xs text-danger text-center">{error}</p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="font-mono text-[10px] px-2 py-1 bg-panel2 border border-line rounded text-muted hover:border-cyanDim hover:text-cyan transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex gap-2 p-3 border-t border-line">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="> type a question..."
                aria-label="Chat input"
                className="flex-1 bg-panel2 border border-line rounded px-3 py-2 font-mono text-xs text-text placeholder-muted focus:outline-none focus:border-cyan transition-colors" />
              <button type="submit" disabled={loading}
                className="font-mono text-xs px-3 py-2 bg-cyan text-ink rounded hover:bg-cyan/80 disabled:opacity-40 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan">
                ›
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

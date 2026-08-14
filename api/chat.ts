import type { VercelRequest, VercelResponse } from '@vercel/node'
import { profile, experience, projects, skills, certifications, leadership, contact } from '../src/data/resume'

// Simple in-memory rate limiter: 10 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const LIMIT = 10
const WINDOW_MS = 10 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  if (entry.count >= LIMIT) return true
  entry.count++
  return false
}

function buildSystemPrompt(): string {
  const expText = experience.map((e) =>
    `- ${e.role} at ${e.org} (${e.dateRange}): ${e.bullets.join(' ')}`
  ).join('\n')

  const projText = projects.map((p) =>
    `- ${p.name} [${p.status}]: ${p.description} Tags: ${p.tags.join(', ')}`
  ).join('\n')

  const skillText = skills.map((s) => `${s.cluster}: ${s.nodes.join(', ')}`).join('\n')
  const certText = certifications.map((c) => c.name).join(', ')
  const leadText = leadership.map((l) => `${l.role} at ${l.org}`).join(', ')

  return `You are a helpful assistant representing ${profile.name}'s portfolio website.
Answer questions about Manahil using ONLY the resume data below. Speak in third person ("Based on Manahil's background...").
Decline any questions unrelated to her professional background politely.
Be concise and recruiter-friendly.

=== RESUME DATA ===
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Email: ${contact.email}
Summary: ${profile.summary}

EXPERIENCE:
${expText}

PROJECTS:
${projText}

SKILLS:
${skillText}

CERTIFICATIONS: ${certText}

LEADERSHIP: ${leadText}

AVAILABILITY: ${contact.availability}
===================`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: '> rate limit exceeded — try again in 10 minutes' })
  }

  const { messages } = req.body
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: '> system error — API not configured' })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 512,
        system: buildSystemPrompt(),
        stream: true,
        messages: messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`)

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') { res.write('data: [DONE]\n\n'); break }
        try {
          const parsed = JSON.parse(data)
          if (parsed.type === 'content_block_delta') {
            res.write(`data: ${JSON.stringify({ text: parsed.delta?.text ?? '' })}\n\n`)
          }
        } catch {}
      }
    }
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ text: '\n> connection interrupted — try again' })}\n\n`)
    res.end()
  }
}

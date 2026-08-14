import type { VercelRequest, VercelResponse } from '@vercel/node'

const RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['project', 'ship', 'built', 'build', 'work on', 'deepfake', 'b2b', 'identity', 'automation', 'ai support', 'assistant'],
    answer: `Manahil has worked on three projects:\n\n**B2B Identity Automation Tool** (Shipped) — PowerShell + Microsoft Graph API solution to automate Azure AD B2B group synchronization at Morgan Stanley. Reduced manual effort and improved reliability of enterprise identity workflows.\n\n**AI Deepfake Detector** (In Progress) — ML system using CNNs and frequency-domain analysis to detect AI-generated deepfake images and videos. Trained on real vs. synthetic media datasets.\n\n**AI Support Assistant** (In Progress) — Backend design of an AI-powered enterprise support assistant using Generative AI and LLM integration.`,
  },
  {
    keywords: ['experience', 'work', 'job', 'morgan stanley', 'intern', 'internship', 'role', 'position', 'elte', 'demonstrator', 'teaching'],
    answer: `Manahil has the following experience:\n\n**Morgan Stanley** — Cloud IAM Engineer Intern (Sep 2025–Present): PowerShell automation for Azure AD B2B group sync, Microsoft Graph API, RBAC, and enterprise cloud infrastructure.\n\n**Morgan Stanley** — Frontend Developer Intern (Jan–Aug 2025): Built enterprise SPAs using Angular, TypeScript, HTML/CSS. Agile development, sprint planning, code reviews.\n\n**ELTE** — Demonstrator, Operating Systems (Feb–Jul 2026): Practical sessions on Bash and PowerShell scripting, mentoring students.\n\n**Meritorious Education Network** — Junior IT Assistant (2021–2022): Backend systems, IT operations, digital platform maintenance.`,
  },
  {
    keywords: ['skill', 'tech', 'stack', 'know', 'language', 'tool', 'azure', 'powershell', 'python', 'typescript', 'angular', 'cloud', 'iam'],
    answer: `Manahil's technical skills include:\n\n**Cloud & Identity**: Microsoft Azure, Azure AD / Entra ID, IAM, RBAC, B2B Identity, Microsoft Graph API, Access Governance\n\n**Programming**: Python, PowerShell, Java, C, C#, TypeScript, JavaScript\n\n**Web**: Angular, HTML, CSS, Laravel, REST APIs\n\n**AI & Concepts**: Machine Learning, Generative AI, Prompt Engineering, OOP, Data Structures, Algorithms\n\n**Tools**: Git, GitHub, Bitbucket, Docker, VS Code`,
  },
  {
    keywords: ['cert', 'certification', 'clearance', 'kali', 'network security', 'encryption', 'firewall', 'forensic', 'google'],
    answer: `Manahil holds 7 certifications:\n\n• Python by Google\n• Kali Linux\n• Network Security\n• Encryption\n• Basics of Firewall\n• Cyber Forensics\n• Learning PowerShell`,
  },
  {
    keywords: ['education', 'university', 'degree', 'study', 'student', 'elte', 'computer science', 'bsc', 'budapest'],
    answer: `Manahil is a final-year BSc Computer Science student at Eötvös Loránd University (ELTE) in Budapest, Hungary. She combines her academic studies with industry experience at Morgan Stanley.`,
  },
  {
    keywords: ['leadership', 'ambassador', 'mentor', 'committee', 'hook', 'involvement', 'community'],
    answer: `Manahil is actively involved at ELTE in several leadership roles:\n\n• International Student Ambassador\n• International Student Advisory Committee Member\n• Senior Student Mentor\n• HOOK Mentor\n\nShe supports international students and contributes to the university community.`,
  },
  {
    keywords: ['contact', 'email', 'phone', 'linkedin', 'reach', 'hire', 'connect'],
    answer: `You can reach Manahil at:\n\n• **Email**: manahilnawaz10@gmail.com\n• **LinkedIn**: linkedin.com/in/manahilnawaz\n• **Phone**: +36 20 575 2462\n\nShe is open to full-time roles and internships in Cloud, IAM, and AI.`,
  },
  {
    keywords: ['available', 'open', 'hire', 'full-time', 'fulltime', 'internship', 'opportunity', 'looking', 'job'],
    answer: `Yes! Manahil is open to full-time roles and internships in Cloud, IAM, and AI. She brings hands-on experience from Morgan Stanley and a strong academic background in Computer Science from ELTE Budapest.`,
  },
  {
    keywords: ['who', 'about', 'tell me', 'introduce', 'summary', 'background', 'manahil'],
    answer: `Manahil Nawaz is a Cloud IAM Engineer and final-year BSc Computer Science student at ELTE Budapest. She currently works as a Technology Intern at Morgan Stanley, focusing on cloud identity and access management.\n\nShe is experienced in Microsoft Azure, Microsoft Graph API, PowerShell automation, and enterprise identity systems, with a passion for AI, cloud technologies, and building scalable software.`,
  },
  {
    keywords: ['location', 'where', 'based', 'country', 'city', 'hungary'],
    answer: `Manahil is based in Budapest, Hungary, where she studies at ELTE and works at Morgan Stanley.`,
  },
]

const FALLBACK = `I can answer questions about Manahil's background, experience, projects, skills, certifications, and contact info. Try asking:\n\n• "What projects has she worked on?"\n• "What is her tech stack?"\n• "Is she open to new roles?"\n• "Tell me about her experience at Morgan Stanley"`

function findAnswer(message: string): string {
  const lower = message.toLowerCase()
  for (const { keywords, answer } of RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return answer
  }
  return FALLBACK
}

// Rate limiter
const rateLimitMap = new Map<string, { count: number; reset: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 10 * 60 * 1000 })
    return false
  }
  if (entry.count >= 30) return true
  entry.count++
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: '> rate limit exceeded — try again later' })
  }

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const answer = findAnswer(lastMessage)

  // Stream the response word by word via SSE to match the existing ChatWidget
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const words = answer.split(' ')
  for (let i = 0; i < words.length; i++) {
    const token = (i === 0 ? '' : ' ') + words[i]
    res.write(`data: ${JSON.stringify({ text: token })}\n\n`)
    // small delay so it feels like streaming
    await new Promise(r => setTimeout(r, 18))
  }

  res.write('data: [DONE]\n\n')
  res.end()
}

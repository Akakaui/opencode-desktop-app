import { useEffect, useState } from 'react'
import './App.css'

const TYPING_LINES = [
  "Sure! Here's a complete FastAPI setup...\n\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/')\ndef root():\n    return {'message': 'Hello!'}\n",
  'Now writing tests for your API endpoints...',
  'Done! Want me to add authentication next?',
]

function useTypingEffect(lines, speed = 28) {
  const [text, setText] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const line = lines[lineIdx]
    const timer = setTimeout(() => {
      if (charIdx < line.length) {
        setText(line.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      } else {
        setTimeout(() => {
          setLineIdx((l) => (l + 1) % lines.length)
          setCharIdx(0)
          setText('')
        }, 3000)
      }
    }, speed + Math.random() * 18)
    return () => clearTimeout(timer)
  }, [charIdx, lineIdx, lines, speed])

  return text
}

function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a href="#" className="brand">
          <img src="/assets/icon.png" alt="" className="brand-logo" />
          <span className="brand-name">AI Stack</span>
        </a>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          <button onClick={() => scrollTo('how-it-works')}>How it Works</button>
          <button onClick={() => scrollTo('install-pc')}>Windows</button>
          <button onClick={() => scrollTo('install-vps')}>VPS</button>
          <button onClick={() => scrollTo('faq')}>FAQ</button>
        </nav>
        <button className="btn btn-amber nav-cta" onClick={() => scrollTo('download')}>Download</button>
        <button className={`nav-toggle${open ? ' active' : ''}`} onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const typingText = useTypingEffect(TYPING_LINES)

  return (
    <section className="hero" id="download">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="badge-row">
            <span className="badge">Open Source</span>
            <span className="badge badge-muted">Free Forever</span>
          </div>
          <h1 className="hero-title">
            OpenCode <span className="amp">&amp;</span> OpenChamber.<br />
            <span className="accent">One Launcher.</span>
          </h1>
          <p className="hero-lead">
            Stop juggling two terminals. <strong>AI Stack</strong> boots OpenCode
            and OpenChamber together — as a native Windows desktop app or a
            self-hosted VPS deployment.
          </p>
          <div className="hero-tags">
            <span className="tag">Windows .EXE</span>
            <span className="tag">Docker VPS</span>
            <span className="tag">Phone Access</span>
            <span className="tag">Auto-updates</span>
          </div>
          <div className="hero-actions">
            <a href="https://drive.google.com/uc?id=1k_-D8ai9zpO8RgEcVUKjUXCmdWkH3WP5" className="btn btn-amber btn-lg" target="_blank" rel="noopener">
              <DownloadIcon /> Download for Windows
            </a>
            <a href="#install-vps" className="btn btn-outline btn-lg">
              <ServerIcon /> Deploy on VPS
            </a>
          </div>
          <p className="hero-note">Windows 10/11 · 64-bit · Requires Node.js 20+</p>
        </div>
        <div className="hero-visual">
          <div className="mockup">
            <div className="mockup-bar">
              <div className="mockup-dots">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
              <span className="mockup-title">AI Stack — OpenChamber</span>
            </div>
            <div className="mockup-body">
              <div className="mock-sidebar">
                <div className="mock-nav-item active">
                  <SessionsIcon /> Sessions
                </div>
                <div className="mock-nav-item">
                  <ModelsIcon /> Models
                </div>
                <div className="mock-nav-item">
                  <SettingsIcon /> Settings
                </div>
              </div>
              <div className="mock-chat">
                <div className="mock-chat-header">New Session · Claude Sonnet</div>
                <div className="mock-messages">
                  <div className="mock-msg msg-user">Write me a REST API in Python with FastAPI</div>
                  <div className="mock-msg msg-agent">
                    <span className="agent-badge">OpenCode</span>
                    <span className="typing-text">{typingText}<span className="cursor" /></span>
                  </div>
                </div>
                <div className="mock-input">
                  <span className="mock-placeholder">Type a message...</span>
                  <span className="mock-send">&rarr;</span>
                </div>
              </div>
            </div>
            <div className="mockup-status">
              <span className="dot-green" /> OpenCode :4095
              <span className="status-sep" />
              <span className="dot-green" /> OpenChamber :3000
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Architecture</span>
          <h2 className="section-title">How it <span className="accent">works</span></h2>
          <p className="section-sub">AI Stack is a thin, smart launcher. It starts both services and wires them together.</p>
        </div>
        <div className="arch-flow">
          <div className="arch-node">
            <span className="arch-icon">&#128100;</span>
            <span className="arch-label">You</span>
            <span className="arch-sub">Open the app / browser</span>
          </div>
          <div className="arch-arrow">&darr;</div>
          <div className="arch-node app-node">
            <span className="arch-icon"><img src="/assets/icon.png" alt="" width="28" height="28" /></span>
            <span className="arch-label">AI Stack</span>
            <span className="arch-sub">Unified Launcher</span>
          </div>
          <div className="arch-arrow">&darr;</div>
          <div className="arch-split">
            <div className="arch-node">
              <span className="arch-label">OpenCode</span>
              <span className="arch-sub">AI backend · :4095</span>
            </div>
            <div className="arch-node">
              <span className="arch-label">OpenChamber</span>
              <span className="arch-sub">Web UI · :3000</span>
            </div>
          </div>
        </div>
        <div className="steps-grid">
          {[
            ['01', 'You launch AI Stack', 'Double-click the desktop icon or run <code>docker compose up -d</code> on your VPS.'],
            ['02', 'Services boot', 'OpenCode starts on port 4095, then OpenChamber connects on port 3000.'],
            ['03', 'Start coding', 'The full OpenChamber interface opens. No config files. Just code.'],
            ['04', 'Close when done', 'Both services shut down cleanly. No zombie processes left.'],
          ].map(([num, title, desc]) => (
            <div className="step-card" key={num}>
              <div className="step-num">{num}</div>
              <h3>{title}</h3>
              <p dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function InstallStep({ num, title, children }) {
  return (
    <div className="install-step">
      <div className="step-head">
        <span className="step-badge">{num}</span>
        <h3>{title}</h3>
      </div>
      <div className="step-body">{children}</div>
    </div>
  )
}

function CodeBlock({ id, code }) {
  const copy = () => {
    const el = document.getElementById(id)
    if (!el) return
    navigator.clipboard.writeText(el.textContent.trim())
    const btn = el.parentElement.parentElement.querySelector('.copy-btn')
    btn.textContent = 'Copied!'
    btn.classList.add('copied')
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied') }, 2000)
  }
  return (
    <div className="code-block">
      <pre><code id={id}>{code}</code></pre>
      <button className="copy-btn" onClick={copy}>Copy</button>
    </div>
  )
}

function InstallPC() {
  return (
    <section className="section pc-section" id="install-pc">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Desktop App</span>
          <h2 className="section-title">Install on <span className="accent">Windows</span></h2>
          <p className="section-sub">A native installer with a desktop shortcut. Download once, use forever.</p>
        </div>
        <div className="install-grid">
          <div className="install-steps">
            <InstallStep num={1} title="Install Node.js 20+">
              <p>AI Stack needs Node.js to run OpenCode and OpenChamber.</p>
              <div className="callout info">
                <InfoIcon /> Download the <strong>LTS version</strong> from <a href="https://nodejs.org" className="link" target="_blank" rel="noopener">nodejs.org</a>. Restart after installing.
              </div>
              <CodeBlock id="code-node-check" code="node --version" />
              <p className="hint">You should see v20.x.x or higher.</p>
            </InstallStep>
            <InstallStep num={2} title="Install OpenCode &amp; OpenChamber">
              <p>Open <strong>Command Prompt</strong> or <strong>PowerShell</strong> and run:</p>
              <CodeBlock id="code-global-install" code="npm install -g opencode-ai @openchamber/web" />
              <p className="hint">If you skip this, AI Stack will prompt you on first launch.</p>
            </InstallStep>
            <InstallStep num={3} title="Download AI Stack Installer">
              <a href="https://drive.google.com/uc?id=1k_-D8ai9zpO8RgEcVUKjUXCmdWkH3WP5" className="btn btn-amber" target="_blank" rel="noopener">
                <DownloadIcon /> Download AI Stack Setup.exe
              </a>
              <div className="callout warn">
                <WarnIcon /> SmartScreen may show a prompt — click <strong>&quot;More info&quot;</strong> then <strong>&quot;Run anyway&quot;</strong>. The file is safe.
              </div>
            </InstallStep>
            <InstallStep num={4} title="Run the Installer">
              <p>Double-click <code>AI Stack Setup.exe</code>. In under 30 seconds you'll have a desktop shortcut and Start Menu entry.</p>
              <ul className="check-list">
                <li>A desktop shortcut icon</li>
                <li>Start Menu entry</li>
                <li>Everything ready to launch</li>
              </ul>
            </InstallStep>
            <InstallStep num={5} title="Add your API Key">
              <p>Open AI Stack &rarr; Settings &rarr; Providers &rarr; paste your API key.</p>
              <div className="provider-row">
                {['OpenAI', 'Anthropic', 'Google', 'Groq', 'Mistral', 'Ollama'].map((p) => (
                  <span className="provider-chip" key={p}>{p}</span>
                ))}
              </div>
            </InstallStep>
          </div>
          <div className="install-sidebar">
            <div className="sidebar-card">
              <h4>Requirements</h4>
              <ul className="req-list">
                <li><span className="req-label">OS</span> Windows 10 / 11 (64-bit)</li>
                <li><span className="req-label">Node</span> v20 or higher</li>
                <li><span className="req-label">RAM</span> 4 GB minimum</li>
                <li><span className="req-label">Disk</span> ~500 MB free</li>
              </ul>
            </div>
            <div className="sidebar-card">
              <h4>Ports</h4>
              <div className="port-row"><span className="port-badge">:4095</span><span>OpenCode</span></div>
              <div className="port-row"><span className="port-badge">:3000</span><span>OpenChamber</span></div>
              <p className="sidebar-note">Both local-only. Nothing exposed to the internet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InstallVPS() {
  return (
    <section className="section vps-section" id="install-vps">
      <div className="container">
        <div className="section-header">
          <span className="section-label">VPS / Web App</span>
          <h2 className="section-title">Deploy on a <span className="accent">VPS</span></h2>
          <p className="section-sub">Run the full stack on any cloud server. Access from any device.</p>
        </div>
        <div className="install-grid">
          <div className="install-steps">
            <InstallStep num={1} title="Get a VPS">
              <p>Any Linux VPS with 1 GB+ RAM works:</p>
              <div className="provider-row">
                {['DigitalOcean', 'Hetzner', 'Vultr', 'Linode', 'AWS EC2'].map((p) => (
                  <span className="provider-chip" key={p}>{p}</span>
                ))}
              </div>
            </InstallStep>
            <InstallStep num={2} title="Install Docker">
              <CodeBlock id="code-docker-install" code="curl -fsSL https://get.docker.com | sh" />
              <CodeBlock id="code-docker-group" code="sudo usermod -aG docker $USER && newgrp docker" />
            </InstallStep>
            <InstallStep num={3} title="Download compose file">
              <CodeBlock id="code-compose-dl" code="curl -fsSL https://raw.githubusercontent.com/Akakaui/opencode-desktop-app/main/docker/docker-compose.yml -o docker-compose.yml" />
            </InstallStep>
            <InstallStep num={4} title="Start the stack">
              <CodeBlock id="code-compose-up" code="docker compose up -d" />
              <CodeBlock id="code-compose-ps" code="docker compose ps" />
            </InstallStep>
            <InstallStep num={5} title="Open in browser">
              <div className="url-box">http://&lt;your-vps-ip&gt;:3000</div>
              <div className="callout info"><InfoIcon /> Open port 3000: <code>sudo ufw allow 3000</code></div>
            </InstallStep>
            <InstallStep num={6} title="Add a domain &amp; HTTPS">
              <p>Use Nginx + Let's Encrypt:</p>
              <CodeBlock id="code-nginx" code="sudo apt install nginx certbot python3-certbot-nginx -y" />
            </InstallStep>
          </div>
          <div className="install-sidebar">
            <div className="sidebar-card">
              <h4>Requirements</h4>
              <ul className="req-list">
                <li><span className="req-label">OS</span> Ubuntu 22.04 / 24.04</li>
                <li><span className="req-label">RAM</span> 1 GB min (2 GB rec.)</li>
                <li><span className="req-label">CPU</span> 1 vCPU+</li>
                <li><span className="req-label">Port</span> 3000 open</li>
              </ul>
            </div>
            <div className="sidebar-card">
              <h4>Auto-updates</h4>
              <p>Watchtower checks for updates every hour and restarts automatically. Zero maintenance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Common <span className="accent">questions</span></h2>
        </div>
        <div className="faq-grid">
          {[
            ['Desktop vs VPS — what\'s the difference?', 'The desktop installer bundles everything into a native Windows app. The VPS deployment runs on a cloud server so you can access it from any device.'],
            ['Does it work on macOS or Linux?', 'The .exe is Windows only. On macOS/Linux, clone the repo, run <code>cd desktop && npm install && npm start</code>. The VPS deployment works on any OS via Docker.'],
            ['Will updates break anything?', 'No. AI Stack is a thin wrapper — it just runs <code>opencode serve</code> and <code>openchamber serve</code>. Updates are picked up automatically.'],
            ['How do I set a password?', 'Inside OpenChamber: Settings → Security → set a password. AI Stack doesn\'t control this.'],
            ['What if ports are in use?', 'AI Stack detects occupied ports and skips starting that service. Use env vars to change ports.'],
            ['Is my data stored locally?', 'Yes. Desktop data goes to <code>%APPDATA%/ai-stack-desktop</code>. VPS data goes to a Docker volume on your server.'],
          ].map(([q, a], i) => (
            <div className="faq-card" key={i}>
              <h3>{q}</h3>
              <p dangerouslySetInnerHTML={{ __html: a }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/assets/icon.png" alt="" className="footer-logo" />
            <div>
              <div className="footer-name">AI Stack</div>
              <div className="footer-sub">OpenCode + OpenChamber, unified.</div>
            </div>
          </div>
          <div className="footer-links">
            <a href="https://github.com/Akakaui/opencode-desktop-app" target="_blank" rel="noopener">
              <GitHubIcon /> GitHub
            </a>
            <a href="mailto:fchibuike122@gmail.com">
              <EmailIcon /> Email
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 AI Stack. Open source. OpenCode and OpenChamber are independent projects.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <InstallPC />
      <InstallVPS />
      <FAQ />
      <Footer />
    </>
  )
}

function DownloadIcon() {
  return (
    <svg className="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
  )
}
function ServerIcon() {
  return (
    <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  )
}
function SessionsIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
  )
}
function ModelsIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>
  )
}
function InfoIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  )
}
function WarnIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  )
}
function GitHubIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
  )
}
function EmailIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  )
}

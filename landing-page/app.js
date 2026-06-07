document.addEventListener('DOMContentLoaded', () => {
  setupTyping();
  setupScrollNav();
});

// ── Typing animation in hero mockup ─────────────────────────────
function setupTyping() {
  const el = document.querySelector('.typing-effect');
  if (!el) return;

  const lines = [
    "Sure! Here's a complete FastAPI setup...\n\n```python\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/')\ndef root():\n    return {'message': 'Hello!'}\n```",
    "Now writing tests for your API endpoints...",
    "Done! Want me to add authentication next?"
  ];

  let lineIdx = 0, charIdx = 0;
  el.textContent = '';

  function type() {
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      el.textContent += line[charIdx++];
      setTimeout(type, 28 + Math.random() * 18);
    } else {
      lineIdx = (lineIdx + 1) % lines.length;
      charIdx = 0;
      setTimeout(() => { el.textContent = ''; type(); }, 3000);
    }
  }

  setTimeout(type, 800);
}

// ── Navbar active state on scroll ───────────────────────────────
function setupScrollNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,0.5)'
      : 'none';
  }, { passive: true });
}

// ── Copy code to clipboard ───────────────────────────────────────
function copyCode(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

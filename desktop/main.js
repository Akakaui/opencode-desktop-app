const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');
const net  = require('net');

let opencodeProcess    = null;
let openchamberProcess = null;
let mainWindow         = null;

const PORT_OPENCODE    = 4095;
const PORT_OPENCHAMBER = 3000;

// ── Check a CLI tool exists on system PATH and is functional ──────
function commandExists(cmd) {
  try {
    // Run the command with --help to verify it is actually installed and functional
    // (stale or broken shims left by failed installations will throw an error)
    execSync(`${cmd} --help`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// ── Show friendly "install tools first" dialog ────────────────────
async function checkPrerequisites() {
  const missing = [];
  if (!commandExists('opencode'))    missing.push('opencode-ai');
  if (!commandExists('openchamber')) missing.push('@openchamber/web');

  if (missing.length === 0) return true;

  const installCmd = `npm install -g ${missing.join(' ')}`;

  const choice = await dialog.showMessageBox({
    type: 'warning',
    title: 'Missing tools',
    message: 'AI Stack needs two tools to be installed globally.',
    detail:
      `The following packages were not found on your system:\n\n` +
      missing.map(m => `  • ${m}`).join('\n') +
      `\n\nOpen a terminal and run:\n\n  ${installCmd}\n\nThen restart AI Stack.`,
    buttons: ['Copy install command', 'Quit'],
    defaultId: 0,
    cancelId: 1
  });

  if (choice.response === 0) {
    require('electron').clipboard.writeText(installCmd);
    await dialog.showMessageBox({
      type: 'info',
      title: 'Copied!',
      message: 'Install command copied to clipboard.',
      detail: 'Paste it into a terminal (Command Prompt / PowerShell / Terminal), run it, then restart AI Stack.',
      buttons: ['OK']
    });
  }
  app.quit();
  return false;
}

// ── Check if a port is already bound ─────────────────────────────
function isPortInUse(port) {
  return new Promise(resolve => {
    const s = net.createServer()
      .once('error', err => resolve(err.code === 'EADDRINUSE'))
      .once('listening', () => { s.close(); resolve(false); })
      .listen(port, '127.0.0.1');
  });
}

// ── Poll until a port is open (service ready) ─────────────────────
function waitForPort(port, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(async () => {
      if (await isPortInUse(port)) {
        clearInterval(iv); resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(iv); reject(new Error(`Timed out waiting for port ${port}`));
      }
    }, 500);
  });
}

// ── Write minimal OpenCode config ─────────────────────────────────
function writeOpenCodeConfig() {
  const dataDir   = path.join(app.getPath('userData'), 'ai-stack-data');
  const configDir = path.join(dataDir, '.config', 'opencode');
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(
    path.join(configDir, 'opencode.json'),
    JSON.stringify({
      "$schema": "https://opencode.ai/config.json",
      "server": { "port": PORT_OPENCODE, "hostname": "127.0.0.1" },
      "permission": { "bash": "allow", "edit": "allow", "webfetch": "allow", "read": "allow" }
    }, null, 2),
    'utf8'
  );
  return dataDir;
}

// ── Spawn a child process and pipe its output ─────────────────────
function spawnService(name, cmd, args, env) {
  const proc = spawn(cmd, args, {
    env: { ...process.env, ...env },
    shell: process.platform === 'win32'
  });
  proc.stdout.on('data', d => process.stdout.write(`[${name}] ${d}`));
  proc.stderr.on('data', d => process.stderr.write(`[${name}] ${d}`));
  return proc;
}

// ── Start OpenCode + OpenChamber ──────────────────────────────────
async function startServices() {
  const dataDir = writeOpenCodeConfig();

  // OpenCode
  if (await isPortInUse(PORT_OPENCODE)) {
    console.log(`[OpenCode] already on :${PORT_OPENCODE}`);
  } else {
    opencodeProcess = spawnService(
      'OpenCode', 'opencode', ['serve', '--port', String(PORT_OPENCODE)],
      { XDG_DATA_HOME: dataDir }
    );
  }
  try   { await waitForPort(PORT_OPENCODE); console.log('[OpenCode] Ready'); }
  catch (e) { console.error('[OpenCode]', e.message); }

  // OpenChamber
  if (await isPortInUse(PORT_OPENCHAMBER)) {
    console.log(`[OpenChamber] already on :${PORT_OPENCHAMBER}`);
  } else {
    openchamberProcess = spawnService(
      'OpenChamber',
      'openchamber',
      ['serve', '--port', String(PORT_OPENCHAMBER), '--host', '127.0.0.1', '--foreground'],
      { OPENCODE_HOST: `http://localhost:${PORT_OPENCODE}` }
    );
  }
  try   { await waitForPort(PORT_OPENCHAMBER); console.log('[OpenChamber] Ready'); }
  catch (e) { console.error('[OpenChamber]', e.message); }
}

// ── Create main window ────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 860,
    title: 'AI Stack',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT_OPENCHAMBER}`);

  // Retry if OpenChamber isn't ready yet
  mainWindow.webContents.on('did-fail-load', () => {
    setTimeout(() => mainWindow?.loadURL(`http://localhost:${PORT_OPENCHAMBER}`), 2000);
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── Minimal menu ──────────────────────────────────────────────────
function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' }, { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'App',
      submenu: [
        { label: 'Open Data Folder', click: () => shell.openPath(path.join(app.getPath('userData'), 'ai-stack-data')) },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ]));
}

// ── Lifecycle ─────────────────────────────────────────────────────
app.whenReady().then(async () => {
  buildMenu();

  const ok = await checkPrerequisites();
  if (!ok) return;

  try { await startServices(); } catch (e) { console.error('Startup error:', e); }

  createWindow();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});

app.on('window-all-closed', () => {
  opencodeProcess?.kill('SIGINT');
  openchamberProcess?.kill('SIGINT');
  app.quit();
});

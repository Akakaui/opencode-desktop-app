/**
 * supervisor.js
 * Runs inside the Docker container.
 * Starts OpenCode and OpenChamber, restarts them if they crash,
 * and shuts them down cleanly when the container stops.
 */

const { spawn } = require('child_process');
const fs = require('fs');

const STACK_DATA_DIR   = process.env.STACK_DATA_DIR   || '/root/.local/share/ai-stack';
const PORT_OPENCODE    = process.env.PORT_OPENCODE    || '4095';
const PORT_OPENCHAMBER = process.env.PORT_OPENCHAMBER || '3000';

// Ensure data directory exists
fs.mkdirSync(STACK_DATA_DIR, { recursive: true });

// ── Service definitions ───────────────────────────────────────────
function buildServices() {
  const opencodeEnv = {
    XDG_DATA_HOME: STACK_DATA_DIR,
  };
  const openchamberArgs = [
    'serve',
    '--port', PORT_OPENCHAMBER,
    '--host', '0.0.0.0',
    '--foreground'
  ];

  return [
    {
      name: 'OpenCode',
      command: 'opencode',
      args: ['serve', '--port', PORT_OPENCODE],
      env: opencodeEnv
    },
    {
      name: 'OpenChamber',
      command: 'openchamber',
      args: openchamberArgs,
      env: {
        OPENCODE_HOST: `http://127.0.0.1:${PORT_OPENCODE}`
      }
    }
  ];
}

// ── Process manager ───────────────────────────────────────────────
const runningProcesses = {};
let shuttingDown = false;

function startService(service) {
  console.log(`[Supervisor] Starting ${service.name}...`);

  const proc = spawn(service.command, service.args, {
    env: { ...process.env, ...service.env },
    shell: true
  });

  proc.stdout.on('data', d => process.stdout.write(`[${service.name}] ${d}`));
  proc.stderr.on('data', d => process.stderr.write(`[${service.name}] ${d}`));

  proc.on('close', (code) => {
    console.log(`[Supervisor] ${service.name} exited (code ${code})`);
    delete runningProcesses[service.name];

    if (!shuttingDown) {
      console.log(`[Supervisor] Restarting ${service.name} in 3s...`);
      setTimeout(() => startService(service), 3000);
    }
  });

  runningProcesses[service.name] = proc;
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('[Supervisor] Shutting down...');
  for (const name in runningProcesses) {
    runningProcesses[name].kill('SIGINT');
  }
  setTimeout(() => process.exit(0), 2000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);

// ── Boot ──────────────────────────────────────────────────────────
buildServices().forEach(startService);

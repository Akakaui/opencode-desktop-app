# AI Stack Desktop Launcher

A lightweight, unified launcher for running **OpenCode** (AI backend) and **OpenChamber** (web interface) together. 

---

## 💡 Why this exists vs. `ai-stack-setup.sh`

It is important to understand the difference between this wrapper/launcher and the root-level `ai-stack-setup.sh` script:

*   **`ai-stack-setup.sh` (The Complete AI Dev Suite):** This bash script is designed for a full Linux development environment (VPS or GitHub Codespaces). It installs and runs the **entire multi-service developer workspace** inside a `tmux` session, including Nginx routing for subpaths, SSL certificates, **Open Design**, and **Agent-Browser** stream/dashboard tools.
*   **`desktop/` & `docker/` (The Unified Launcher):** This launcher is a clean, minimal wrapper focused **exclusively** on running **OpenCode** and **OpenChamber** as a single service. It doesn't configure web proxies, tmux, or external tools. It simply starts both daemons, binds them together, and shuts them down cleanly.

---

## 🚀 Deployment Scenarios

This launcher is built to support three different usage scenarios depending on how and where you want to access the app:

### Scenario A: As a native PC Desktop App (Windows .EXE)
Ideal for local Windows developers who want a traditional desktop application experience.
*   **How it works:** Running the installer installs the app and creates a desktop shortcut icon (OpenChamber capsule logo). When double-clicked, it spawns OpenCode silently in the background on port `4095`, connects OpenChamber to it, and loads the interface inside a native desktop window on port `3000`.
*   **Prerequisites:** You must have Node.js installed on your PC, and have installed the tools globally via:
    ```cmd
    npm install -g opencode-ai @openchamber/web
    ```
*   **Lifecycle:** Closing the window automatically kills both the background OpenCode and OpenChamber daemons, keeping your system processes clean.

### Scenario B: As a local PC Web App (via CLI / Terminal)
For developers on macOS, Linux, or Windows who prefer accessing the app directly from their standard web browser (Chrome, Edge, Safari) instead of a native desktop window.
*   **How it works:** Runs the launcher directly from the terminal or npm commands.
*   **How to run from source:**
    ```bash
    cd desktop
    npm install
    npm start
    ```
*   **How to run via npm (if published):**
    ```bash
    npm install -g your-package-name
    ai-stack-desktop
    ```
    Once running, open `http://localhost:3000` in your browser.

### Scenario C: As a remote VPS Web App (via Docker Compose)
For self-hosting on a cloud server (DigitalOcean, Hetzner, AWS, etc.) so you can access your personal AI assistant interface from any device (laptop, tablet, phone) over the internet.
*   **How it works:** Runs both services inside a single Docker container. OpenCode is locked inside the container network (unexposed to the internet for security), while OpenChamber is exposed on port `3000`.
*   **Features:** Data persists in a named volume (`ai-stack-data`). Includes **Watchtower** for fully automated container updates whenever new builds are released.
*   **How to run:** Copy the `docker-compose.yml` to your VPS and start it:
    ```bash
    docker compose up -d
    ```

---

## 🛠️ Developer Details & Architecture

### Upstream Independence (No native node-gyp issues)
Earlier iterations of this desktop wrapper bundled `opencode-ai` directly inside the Electron app package. However, `opencode-ai` depends on `better-sqlite3`, a native C++ module. Compiling native modules for Windows inside Electron requires C++ compilers, Python, and specific Visual Studio Build Tools, which fails for most end-users.

To solve this, this launcher uses a **system-PATH execution model**:
1. It looks for the globally installed `opencode` and `openchamber` binaries in the user's system PATH.
2. If it can't find them, it presents a helpful prerequisite popup explaining exactly what npm command to run, copies it to the clipboard, and lets the user retry.
3. This guarantees the desktop wrapper remains extremely lightweight (~77MB compiled installer) and never fails during installation due to C++ compilation errors.

# AI Stack Launcher (OpenCode + OpenChamber)

A lightweight, unified launcher to run **OpenCode** (AI backend) and **OpenChamber** (web interface) together. 

This repository packages the two services into a single unified launcher, supporting:
1.  **As a Windows Desktop App (.EXE):** Run it in a native window with a custom icon.
2.  **As a local Web App (CLI):** Run it from your terminal on Windows, macOS, or Linux.
3.  **As a remote VPS Web App (Docker Compose):** Deploy it on a cloud server with persistent volumes and Watchtower auto-updates.

---

## 🚀 Deployment Scenarios

### Scenario A: Windows Desktop App (.EXE)
Ideal for Windows users who want a traditional desktop experience.
*   **Prerequisites:** You must have [Node.js](https://nodejs.org) installed on your system.
*   **Step 1:** Open PowerShell or Command Prompt and run the following command to install the required tools globally on your machine:
    ```cmd
    npm install -g opencode-ai @openchamber/web
    ```
    > [!IMPORTANT]
    > **Node.js Version Recommendation (LTS):** It is highly recommended to use a stable LTS version of Node.js (such as **Node v20.x** or **Node v22.x**). Newer experimental or development versions (such as **Node v24.x**) do not have prebuilt binaries for `better-sqlite3` (a dependency of `@openchamber/web` and `opencode-ai`) on the npm registry, which forces npm to compile the module from source. This compilation requires Python and build tools to be installed on your machine and will fail with a `gyp ERR! Could not find any Python installation` error on most systems. Downgrading to Node v20/v22 bypasses this and downloads prebuilt binaries instantly in under 10 seconds.
*   **Step 2:** Download and run `AI Stack Setup.exe`.
*   **Step 3:** Double-click the **AI Stack** desktop shortcut icon to launch.
    *   OpenCode starts silently in the background on port `4095`.
    *   OpenChamber boots and opens inside the native app window on port `3000`, connecting to the backend automatically.
    *   Closing the app window cleanly terminates both background daemons.

### Scenario B: Local Web App (CLI / Terminal)
For users on macOS, Linux, or Windows who prefer to access the application via a standard web browser instead of a native desktop window.
*   **Prerequisites:** Node.js installed on your machine.
*   **Step 1:** Clone this repository and navigate to the `desktop` directory:
    ```bash
    git clone https://github.com/YOUR_USERNAME/opencode-desktop-app.git
    cd opencode-desktop-app/desktop
    ```
*   **Step 2:** Install developer dependencies:
    ```bash
    npm install
    ```
*   **Step 3:** Start the launcher:
    ```bash
    npm start
    ```
*   **Step 4:** Open `http://localhost:3000` in your web browser.

### Scenario C: Self-Hosted VPS Web App (Docker Compose)
For self-hosting on a cloud server (Ubuntu VPS, Debian, CentOS, etc.) so you can access your personal AI assistant interface from any device (laptop, tablet, or mobile phone) over the internet.
*   **Prerequisites:** [Docker & Docker Compose](https://docs.docker.com/engine/install/) installed on your VPS.
*   **Step 1:** Copy [docker-compose.yml](file:///C:/Users/Owner/.gemini/antigravity/scratch/opencode-desktop-app/docker/docker-compose.yml) to your VPS.
*   **Step 2:** Start the stack:
    ```bash
    docker compose up -d
    ```
    *   This pulls the pre-built single-container image that packages both services.
    *   OpenCode is secured inside the internal container network (unexposed to the internet for maximum security).
    *   OpenChamber is exposed on port `3000`.
    *   Database sessions persist inside the `ai-stack-data` volume.
    *   **Watchtower** runs in the background to automatically check for updates and restart the stack with zero manual intervention.

---

## 🛠️ Architecture & Developer Guide

### Upstream Independence (No native node-gyp builds)
To ensure the desktop app runs out-of-the-box for non-technical users without compile errors, we avoid bundling `opencode-ai` inside the Electron package itself. `opencode-ai` depends on native C++ modules (`better-sqlite3`), which require Python and MSBuild compilation on Windows.

Instead, the launcher utilizes a **system-PATH execution model**:
1. Electron checks the system PATH for global installations of `opencode` and `openchamber`.
2. If missing, it displays a friendly startup screen prompting the user to run `npm install -g opencode-ai @openchamber/web`, copies the command to their clipboard, and provides a retry button.
3. This keeps the installer size compact (~77MB) and guarantees zero C++ build issues during installation.

### Packaging the Desktop App (.EXE)
If you want to package the source files into a standalone installer:
1. Ensure you have the developer dependencies installed:
   ```bash
   cd desktop
   npm install
   ```
2. Run the distribution script:
   ```bash
   npm run dist
   ```
3. The compiled installer `AI Stack Setup 1.0.0.exe` will be located in the `desktop/dist/` folder.

### Building the Docker Image
To build and publish your own single-container Docker image:
1. Navigate to the `docker/` directory:
   ```bash
   cd docker
   ```
2. Build your image:
   ```bash
   docker build -t your-username/ai-stack:latest .
   ```
3. Push to your registry:
   ```bash
   docker push your-username/ai-stack:latest
   ```

---

## 📄 License
MIT License. OpenCode and OpenChamber are independent open-source projects maintained by their respective creators.

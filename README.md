# 📊 Slack Pulse

## 📌 Overview

Slack Pulse is a web application that lets you connect to your Slack workspace, send instant messages, and schedule messages to any of your channels.
It uses **Slack OAuth** for authentication, securely stores and manages tokens, and allows you to manage your scheduled messages in an intuitive dashboard.

---

## 🚀 1. Setup Instructions

### **Step 1 – Create a Slack App**

1. Create a Slack account and workspace if you don’t already have one.
2. Go to the **Slack API Console**:
   🔗 [https://api.slack.com/apps](https://api.slack.com/apps)
3. Click **Create New App** → **From Scratch** → Give it a name and choose your workspace.
4. Note down your:

   * `Slack Client ID`
   * `Slack Client Secret`
5. In your app’s settings, go to **OAuth & Permissions** → **Redirect URLs** and add:

   ```
   https://localhost:5000/callback
   ```

   This will be used for **local development**.

---

### **Step 2 – Clone the Repository**

```bash
git clone https://github.com/MrApoorv/slack-pulse.git
cd slack-pulse
```

---

### **Step 3 – Backend Setup (TypeScript + Express)**

1. Move into the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript (if needed) & run:

   ```bash
   npm run build 
   npm run dev
   ```

> **Note:** The backend is already configured for TypeScript (`tsconfig.json` is included).

---

### **Step 4 – Frontend Setup (Next.js + TypeScript)**

1. Move into the frontend folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

> The frontend is built with **Next.js + TypeScript** and connects to the backend for API calls.

---

### **Step 5 – Enable HTTPS for Local Development (Slack Requirement)**

Slack **only allows HTTPS** for OAuth callbacks, so you’ll need to enable HTTPS locally.

#### 5.1 Install Chocolatey (Windows)

Visit: [https://chocolatey.org/install](https://chocolatey.org/install)
Follow the instructions for your system.

#### 5.2 Install mkcert

```bash
choco install mkcert
```

#### 5.3 Install local CA & generate certificates

Inside your `backend` directory:

```bash
mkcert -install
mkcert localhost
```

This will generate:

```
localhost.pem
localhost-key.pem
```

You can then configure your backend server to use these for HTTPS.

---

### **Step 6 – Create `.env` File in Backend**

Inside `backend/.env`:

```env
SLACK_CLIENT_ID=your_id
SLACK_CLIENT_SECRET=your_secret
SLACK_REDIRECT_URI=https://localhost:5000/callback
PORT=5000
```

---

### **Step 7 – Run Both Servers**

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

Visit:

```
https://localhost:3000
```

---

## 📌 2. How to Use

1. Open `https://localhost:3000` in your browser.
2. Click **"Get Started"** → You’ll be redirected to Slack’s OAuth screen.
3. Approve the app → You’ll be redirected to the **Slack Pulse Dashboard**.
4. From here you can:

   * Select a channel
   * Send **instant messages**
   * Schedule messages for the future
5. Below, you’ll see the **list of your scheduled messages**.
6. To **logout** or **switch workspaces**, click **"LOGOUT"** in the top-right corner.

---

Here’s a more detailed rewrite of those two sections while keeping them concise and professional.

---

## 🛠 3. Architectural Overview

### **Backend**

* Built with **TypeScript + Express** for type safety and maintainability.
* Handles the complete **Slack OAuth 2.0** authentication process, including redirect handling and token exchange.
* Securely stores **access tokens** and **refresh tokens** for each workspace. Automatically refreshes tokens when they expire.
* Includes a **scheduler service** that runs every second to check for pending scheduled messages and sends them at the right time.
* Communicates with Slack’s Web API to send, schedule, and cancel messages.
* Configured to run on **HTTPS locally** using mkcert, since Slack requires a secure callback URL during OAuth.

### **Frontend**

* Built with **Next.js + TypeScript** for a fast, modern, and type-safe UI.
* Implements an **interactive dashboard** where users can:

  * View a list of their Slack channels
  * Send instant messages
  * Schedule messages for future delivery
  * View and cancel upcoming scheduled messages
* Fetches data from the backend via REST APIs (`/slack/channels`, `/slack/messages/scheduled`, etc.).
* Uses state management via React hooks to keep the UI in sync with the backend in real-time.

### **OAuth Flow**

1. The user clicks **Get Started** and is redirected to Slack’s OAuth authorization page.
2. The user grants permission for the app to access their workspace.
3. Slack sends an authorization code back to the backend at the `/callback` endpoint.
4. The backend exchanges the authorization code for an **access token** and stores it securely.
5. The stored token is used for all future interactions with Slack’s APIs on behalf of the user.

---

## 4. Challenges & Learnings

**Challenges:**

* **HTTPS requirement for Slack OAuth locally** – Slack enforces HTTPS for redirect URIs, so local development was initially blocked.
  Solved by integrating **mkcert** to create a trusted local certificate for the backend server.
* **Reliable message scheduling** – Slack’s API doesn’t natively support arbitrary scheduling from a local server, so we implemented our own **scheduler loop** that checks every second if any messages are due and sends them instantly.
* **Persistence of scheduled tasks** – Without storage, scheduled messages would be lost on server restarts. We addressed this by **saving schedules in persistent backend storage** so they survive restarts and redeployments.
* **Mapping channel IDs to names** – Slack’s API returns scheduled messages with channel IDs only. We solved this by **fetching channel lists** on login and mapping IDs to human-readable names for display in the dashboard.

**Learnings:**

* Gained deep understanding of **OAuth token lifecycle management** — from acquiring tokens to refreshing them automatically before expiry.
* Learned how to integrate a real-time scheduler with an external API while ensuring **time precision** and **reliability**.
* Appreciated the importance of a **clear separation of concerns** — keeping authentication, token handling, scheduling, and UI rendering in distinct layers made debugging and future scaling easier.
* Strengthened knowledge of **Slack’s Web API** and the practical steps needed to integrate it into a full-stack application.

---
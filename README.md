# Ops Copilot 🤖🚀

![Ops Copilot Demo](docs/media/ops_copilot_gif.gif)

> **"The Autonomous AI Agent that turns IT Chaos into Order."**

## 🚨 The Problem
Modern IT Operations teams are drowning in noise.
- **Alert Fatigue**: Thousands of alerts, but only a few matter.
- **Manual Toil**: Engineers waste hours copy-pasting logs, checking statuses, and writing ticket summaries.
- **Slow MTTR**: Critical incidents sit in queues because human triage is too slow.

## 💡 The Solution: Ops Copilot
Ops Copilot is not just a chatbot. It is an **Agentic AI System** that autonomously manages the incident lifecycle. It acts as a "Level 1 Engineer" that never sleeps.

### 🧠 How It Works
1.  **Ingest**: Listens for incoming tickets in real-time.
2.  **Think (Reasoning)**: Uses **Google Gemini 2.0 Flash** to analyze the ticket content.
3.  **Plan**: Formulates a diagnostic plan (e.g., "I need to check the HTTP status and search the knowledge base").
4.  **Act (Tool Use)**: Executes real tools (`httpCheck`, `logTail`, `kbSearch`) to gather evidence.
5.  **Resolve**:
    -   **Classifies** priority and category.
    -   **Drafts** a professional customer response.
    -   **Escalates** critical issues to Jira automatically.
    -   **Notifies** the team via Slack/n8n.

---

## 🛠️ Technical Architecture & Skills Demonstrated

This project demonstrates a production-ready **Agentic Workflow** using a modern full-stack architecture.

### **Core AI & Data**
*   **LLM**: Google Gemini 2.0 Flash (via API).
*   **RAG (Retrieval Augmented Generation)**: Uses `Transformers.js` to generate embeddings for Knowledge Base retrieval.
*   **Anomaly Detection**: `TensorFlow.js` model running on the backend to score system health metrics.

### **Backend (The "Brain")**
*   **Node.js & Express**: REST API handling agent orchestration.
*   **SQLite**: Persistent storage for tickets, traces, and embeddings.
*   **Tool Use Pattern**: Implements a custom "ReAct" (Reasoning + Acting) loop where the LLM calls JavaScript functions.

### **Frontend (The "Showmanship")**
*   **React 18 & Vite**: Blazing fast UI.
*   **Tailwind CSS & shadcn/ui**: Premium, dark-mode aesthetic.
*   **Real-time Visualization**:
    *   **"Hacker Terminal"**: Visualizes the agent's thought process and tool outputs live.
    *   **Dynamic Charts**: `Recharts` for visualizing ticket traffic and anomalies.

### **DevOps & Automation**
*   **Docker**: Fully containerized application (Frontend + Backend + Nginx) using `docker-compose`.
*   **n8n Integration**: Webhook-based automation for external notifications.

---

## 🚀 Key Features

### 1. Intelligent Triage
The agent reads every ticket and instantly tags it with a **Category** (e.g., Network, Auth, Billing) and **Priority** (Low, Medium, Critical). No human intervention required.

### 2. "Glass Box" Reasoning
Unlike black-box AI, Ops Copilot shows its work. The **Terminal View** lets engineers see exactly what the agent is checking, building trust in its decisions.

### 3. Proactive Action
If the agent detects a critical outage (e.g., HTTP 503), it doesn't just wait. It **proactively creates a Jira ticket** with a full technical analysis and slides a notification card into the UI.

### 4. Workflow Automation
Seamlessly connects to external tools. The demo features a live **n8n Workflow Visualizer** showing how alerts are routed to Slack.

---

## 📦 Installation & Setup

**Prerequisites**: Docker & Docker Compose.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/pranjalmax/ops-copilot.git
    cd ops-copilot
    ```

2.  **Run with Docker**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Dashboard**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👨‍💻 Author
**Pranjal Srivastava**
*   **Role**: Full Stack AI Engineer
*   **Focus**: Building autonomous agents that solve real-world operational problems.

---
*Built with ❤️ using React, Node.js, and Gemini.*

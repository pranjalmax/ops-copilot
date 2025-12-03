# Ops Copilot

Agentic AI for IT Support. Classifies, enriches, and semi-automates support tickets.

## Features
- **Classification**: Auto-tags category and priority.
- **RAG**: Retrieves relevant KB articles and similar tickets.
- **Anomaly Detection**: Checks system health using TF.js model.
- **Agentic Runbook**: Plans and executes diagnostic steps (HTTP check, Log tail).
- **Automation**: Integrates with n8n for notifications.

## Stack
- **Frontend**: React, Vite, Tailwind, shadcn/ui
- **Backend**: Node.js, Express, SQLite, TensorFlow.js, Transformers.js
- **Automation**: n8n

## Setup

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Seed Data & Train Model**
   ```bash
   cd backend
   node seed.js
   node train.js
   ```

3. **Start Backend**
   ```bash
   cd backend
   node server.js
   ```
   Server runs on http://localhost:8080

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173

## Documentation
- [Architecture](./docs/architecture.md)
- [Demo Script](./docs/demo-script.md)

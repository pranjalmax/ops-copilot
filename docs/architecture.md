# Ops Copilot Architecture

## Overview
Ops Copilot is an AI-powered assistant for IT support, designed to reduce MTTR by automating classification, diagnostics, and response drafting.

## Components

### 1. Frontend (User Interface)
- **Tech**: React 18, Vite, Tailwind CSS, shadcn/ui.
- **Features**:
  - **Dashboard**: Real-time ticket list and details.
  - **Trace Timeline**: Visualizes agent reasoning steps.
  - **Analytics**: Charts for ticket volume and priority.
  - **Settings**: Configuration management.

### 2. Backend (API & Logic)
- **Tech**: Node.js 18, Express, Better-SQLite3.
- **Modules**:
  - **Agent**: ReAct-style planner using Gemini 2.0 Flash.
  - **RAG**: Vector search using `@xenova/transformers` (all-MiniLM-L6-v2).
  - **Anomaly Detection**: TensorFlow.js binary classifier.
  - **Database**: SQLite with tables for `tickets`, `kb`, `embeddings`, `traces`.

### 3. Automation (Integration)
- **Tech**: n8n (Workflow Automation).
- **Flows**:
  - **Ticket Notify**: Webhook -> Slack alerts.
  - **Dedupe Digest**: Daily cron -> API check.

## Data Flow
1. **Ticket Ingestion**: Tickets enter via API/Seed.
2. **Analysis Trigger**: User clicks "Run Analysis".
3. **Agent Execution**:
   - **Classify**: LLM categorizes ticket.
   - **Plan**: LLM generates diagnostic steps.
   - **Execute**: Tools (`kbSearch`, `httpCheck`, `logTail`) run.
   - **Draft**: LLM synthesizes findings into a reply.
4. **Action**: User reviews and sends reply or triggers automation.

## Deployment
- **Docker**: Containerized frontend (Nginx) and backend (Node).
- **Compose**: Orchestrates services and volumes.

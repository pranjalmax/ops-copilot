# Ops Copilot Demo Script (60-90s)

## Setup
1. Ensure Docker is running: `docker-compose up`
2. Open `http://localhost:5173`

## Scene 1: The Problem (10s)
- **Speaker**: "Every day, support teams drown in repetitive tickets. Let's see how Ops Copilot fixes this."
- **Action**: Show the Dashboard with a list of tickets.

## Scene 2: Intelligent Analysis (30s)
- **Speaker**: "Here's a critical ticket: 'Production API returning 503'. Instead of manual debugging, I just click 'Run Analysis'."
- **Action**: Click **Run Analysis**.
- **Visual**: Watch the **Agent Trace** animate.
  - "See the agent thinking? It searches the Knowledge Base..."
  - "Checks the HTTP endpoint..."
  - "And even tails the logs for errors."

## Scene 3: Insights & Action (30s)
- **Speaker**: "The agent found the root cause: high memory usage. It even drafted a reply for me."
- **Action**: Scroll to **Draft Reply**.
- **Speaker**: "It also auto-created a Jira ticket because the priority is Critical."
- **Action**: Point to the **Trace** showing `jiraTicket` execution.

## Scene 4: Automation & Closing (20s)
- **Speaker**: "Finally, I can notify the team on Slack with one click."
- **Action**: Click **Notify via n8n** (if implemented) or show the Analytics tab.
- **Speaker**: "Ops Copilot: Turning support toil into automated success."

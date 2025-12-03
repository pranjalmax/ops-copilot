const { db } = require('./db');
const { embedText, cosineSimilarity, bufferToFloat32Array } = require('./rag');
const { detectAnomaly } = require('./anomaly');
const { generateText } = require('./llm');

// Tools
const tools = {
    httpCheck: async (url) => {
        const latency = Math.floor(Math.random() * 100) + 20;
        const status = Math.random() > 0.1 ? 200 : 503;
        return `HTTP ${status} - ${latency}ms`;
    },
    dnsLookup: async (host) => {
        return `IP: 192.168.1.${Math.floor(Math.random() * 255)}`;
    },
    logTail: async (service) => {
        const logs = [
            `[INFO] ${service} started`,
            `[WARN] ${service} high memory usage`,
            `[ERROR] ${service} connection timeout`,
            `[INFO] ${service} processing request`
        ];
        return logs.join('\n');
    },
    kbSearch: async (query) => {
        const queryVec = await embedText(query);
        const rows = db.prepare("SELECT * FROM kb_embeddings").all();

        const results = rows.map(row => {
            const vec = bufferToFloat32Array(row.vector);
            const score = cosineSimilarity(queryVec, vec);
            return { kb_id: row.kb_id, score };
        }).sort((a, b) => b.score - a.score).slice(0, 3);

        const snippets = [];
        for (const res of results) {
            const kb = db.prepare("SELECT title, content FROM kb WHERE id = ?").get(res.kb_id);
            snippets.push(`[KB-${res.kb_id}] ${kb.title}: ${kb.content.substring(0, 100)}...`);
        }
        return snippets.join('\n');
    },
    slackNotify: async (message) => {
        // Mock Slack notification
        // In real app: axios.post(process.env.SLACK_WEBHOOK, { text: message })
        return `Sent Slack message: "${message.substring(0, 50)}..."`;
    },
    jiraTicket: async (summary) => {
        // Mock Jira creation
        const ticketId = `OPS-${Math.floor(Math.random() * 1000) + 1000}`;
        return `Created Jira Ticket: ${ticketId}`;
    }
};

// Helper to parse LLM JSON
function parseJson(text) {
    try {
        // Remove markdown code blocks if present
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
}

// 1. Classify
async function classifyTicketLLM(subject, body) {
    const prompt = `
    You are an IT Support AI. Classify the following ticket.
    Ticket: "${subject} - ${body}"
    
    Return ONLY a JSON object with:
    - category: "network", "auth", "app", or "other"
    - priority: "low", "medium", "high", "critical"
    - summary: A short 1-sentence summary.
    `;

    const response = await generateText(prompt);
    const result = parseJson(response);
    return result || { category: "other", priority: "low", summary: subject };
}

// 2. Plan
async function generatePlanLLM(subject, body, category) {
    const prompt = `
    You are an IT Support Agent.
    Ticket: "${subject} - ${body}"
    Category: ${category}
    
    Available Tools:
    - kbSearch(query: string)
    - httpCheck(url: string)
    - dnsLookup(host: string)
    - logTail(service: string)
    - slackNotify(message: string)
    - jiraTicket(summary: string)
    
    Return ONLY a JSON array of steps to diagnose this issue. Example:
    [{"tool": "kbSearch", "args": {"query": "vpn"}}]
    `;

    const response = await generateText(prompt);
    const plan = parseJson(response);

    // Fallback if LLM fails
    if (!plan || !Array.isArray(plan)) {
        return [{ tool: "kbSearch", args: { query: category } }];
    }
    return plan;
}

// 3. Reply
async function generateReplyLLM(ticket, analysis, traces) {
    const traceText = traces.map(t => `Tool: ${t.action.tool}, Result: ${t.observation}`).join('\n');

    const prompt = `
    Draft a helpful support reply for this ticket.
    Ticket: "${ticket.subject}"
    Analysis: ${JSON.stringify(analysis)}
    Trace Results:
    ${traceText}
    
    Keep it professional and concise.
    `;

    return await generateText(prompt);
}

// Main Pipeline
async function analyzeTicket(ticketId) {
    const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    // 1. Classify
    const classification = await classifyTicketLLM(ticket.subject, ticket.body);
    const { category, priority, summary } = classification;

    db.prepare("UPDATE tickets SET category = ?, priority = ?, summary = ? WHERE id = ?")
        .run(category, priority, summary, ticketId);

    // 2. Anomaly
    const features = [Math.random(), Math.random(), Math.random(), Math.random()];
    const anomaly = await detectAnomaly(features);

    // 3. Plan
    const plan = await generatePlanLLM(ticket.subject, ticket.body, category);

    // 4. Execute
    const traces = [];
    const insertTrace = db.prepare("INSERT INTO traces (ticket_id, step, thought, action, observation) VALUES (?, ?, ?, ?, ?)");

    for (let i = 0; i < plan.length; i++) {
        const step = plan[i];
        const thought = `Step ${i + 1}: Executing ${step.tool}`;
        let observation = "";

        try {
            if (tools[step.tool]) {
                // Extract first arg value dynamically
                const argValue = Object.values(step.args)[0];
                observation = await tools[step.tool](argValue);
            } else {
                observation = "Tool not found";
            }
        } catch (e) {
            observation = `Error: ${e.message}`;
        }

        const actionJson = JSON.stringify(step);
        insertTrace.run(ticketId, i + 1, thought, actionJson, observation);
        traces.push({ step: i + 1, thought, action: step, observation });
    }

    // 5. Reply
    const draftReply = await generateReplyLLM(ticket, { category, priority, anomaly }, traces);

    return {
        summary,
        category,
        priority,
        anomaly,
        plan,
        draftReply,
        traces
    };
}

module.exports = { analyzeTicket };

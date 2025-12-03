require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./lib/db');
const { analyzeTicket } = require('./lib/agent');
const { initLLM } = require('./lib/llm');

const app = express();
const PORT = 8080;

// Init LLM
initLLM(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// GET /api/tickets
app.get('/api/tickets', (req, res) => {
    const tickets = db.prepare("SELECT * FROM tickets ORDER BY created_at DESC").all();
    res.json(tickets);
});

// GET /api/tickets/:id
app.get('/api/tickets/:id', (req, res) => {
    const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(req.params.id);
    if (ticket) res.json(ticket);
    else res.status(404).json({ error: "Ticket not found" });
});

// POST /api/analyze/:id
app.post('/api/analyze/:id', async (req, res) => {
    try {
        const result = await analyzeTicket(req.params.id);
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /api/traces/:ticketId
app.get('/api/traces/:ticketId', (req, res) => {
    const traces = db.prepare("SELECT * FROM traces WHERE ticket_id = ? ORDER BY step ASC").all();
    // Parse action JSON
    const formatted = traces.map(t => ({
        ...t,
        action: JSON.parse(t.action)
    }));
    res.json(formatted);
});

// POST /api/reset
app.post('/api/reset', (req, res) => {
    // Call seed script logic or just clear tables
    // For MVP, we can just respond OK as seed.js does the heavy lifting
    res.json({ message: "Use 'node seed.js' to reset" });
});

// POST /api/automation/notify
app.post('/api/automation/notify', (req, res) => {
    // Proxy to n8n webhook (mock implementation)
    // In real app: axios.post(process.env.N8N_WEBHOOK_URL, req.body)
    console.log("Automation triggered:", req.body);
    res.json({ ok: true, message: "Automation triggered successfully" });
});

// POST /api/simulate
app.post('/api/simulate', (req, res) => {
    const templates = [
        { subject: "VPN connection dropping", body: "My VPN keeps disconnecting every 5 minutes.", category: "network", priority: "medium" },
        { subject: "Payment failed error", body: "Customer reported error 402 on checkout page.", category: "billing", priority: "high" },
        { subject: "Slow dashboard loading", body: "The analytics page takes 10s to load.", category: "app", priority: "low" },
        { subject: "Account locked out", body: "I entered my password wrong too many times.", category: "auth", priority: "high" },
        { subject: "Feature request: Dark mode", body: "Can we add dark mode to the settings?", category: "other", priority: "low" }
    ];

    const t = templates[Math.floor(Math.random() * templates.length)];
    const stmt = db.prepare("INSERT INTO tickets (subject, body, category, priority, status) VALUES (?, ?, ?, ?, 'new')");
    const info = stmt.run(t.subject, t.body, t.category, t.priority);

    res.json({ id: info.lastInsertRowid, ...t });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

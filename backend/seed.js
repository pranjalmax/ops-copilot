const { db, initSchema } = require('./lib/db');
const { embedText, float32ArrayToBuffer } = require('./lib/rag');
const fs = require('fs');
const path = require('path');

async function seed() {
    console.log('Starting seed...');

    // Reset DB
    // Drop child tables first to avoid FK constraint errors
    db.exec("DROP TABLE IF EXISTS traces");
    db.exec("DROP TABLE IF EXISTS kb_embeddings");
    db.exec("DROP TABLE IF EXISTS similar_tickets");

    // Drop parent tables
    db.exec("DROP TABLE IF EXISTS tickets");
    db.exec("DROP TABLE IF EXISTS kb");

    initSchema();

    // Seed KB
    const kbData = [
        {
            title: "Reset MFA",
            content: "To reset MFA, go to the admin panel, search for the user, and click 'Reset MFA'. The user will be prompted to set it up again on next login."
        },
        {
            title: "VPN Connection Issues",
            content: "If a user cannot connect to VPN, check if their certificate is expired. Also verify they are using the correct endpoint (vpn.company.com). If latency is high, check the status page."
        },
        {
            title: "Application 503 Errors",
            content: "503 Service Unavailable usually means the backend pods are down or overloaded. Check the load balancer logs and restart the service if necessary."
        },
        {
            title: "Billing Invoice Missing",
            content: "If a customer reports a missing invoice, check the Stripe dashboard. If the payment failed, the invoice might not be generated. Resend via the billing portal."
        }
    ];

    const insertKb = db.prepare("INSERT INTO kb (title, content) VALUES (?, ?)");
    const insertKbEmbed = db.prepare("INSERT INTO kb_embeddings (kb_id, dim, vector) VALUES (?, ?, ?)");

    for (const item of kbData) {
        const info = insertKb.run(item.title, item.content);
        const kbId = info.lastInsertRowid;
        console.log(`Inserted KB: ${item.title}`);

        // Embed content
        const vector = await embedText(item.title + ": " + item.content);
        const buffer = float32ArrayToBuffer(vector);
        insertKbEmbed.run(kbId, vector.length, buffer);
    }

    // Seed Tickets
    const ticketsData = [
        {
            subject: "Cannot login to VPN",
            body: "Hi, I am getting a connection timeout when trying to connect to the VPN this morning. My internet is fine.",
            category: "network",
            priority: "high"
        },
        {
            subject: "Reset my 2FA please",
            body: "I lost my phone and need to reset my MFA authenticator app.",
            category: "auth",
            priority: "medium"
        },
        {
            subject: "Production API returning 503",
            body: "The main API endpoint is throwing 503 errors intermittently. Customers are complaining.",
            category: "app",
            priority: "critical"
        }
    ];

    const insertTicket = db.prepare("INSERT INTO tickets (subject, body, category, priority) VALUES (?, ?, ?, ?)");

    for (const t of ticketsData) {
        insertTicket.run(t.subject, t.body, t.category, t.priority);
        console.log(`Inserted Ticket: ${t.subject}`);
    }

    console.log('Seed complete.');
}

seed().catch(console.error);

export interface Ticket {
    id: number;
    subject: string;
    body: string;
    status: string;
    category: string;
    priority: string;
    created_at: string;
    summary?: string;
}

export interface TraceStep {
    step: number;
    thought: string;
    action: { tool: string; args: any };
    observation: string;
}

export interface AnalysisResult {
    summary: string;
    category: string;
    priority: string;
    anomaly: { score: number; flag: boolean };
    plan: { tool: string; args: any }[];
    draftReply: string;
    traces: TraceStep[];
}

const API_BASE = "http://localhost:8080/api";

export async function getTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/tickets`);
    return res.json();
}

export async function getTicket(id: number): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets/${id}`);
    return res.json();
}

export async function analyzeTicket(id: number): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/analyze/${id}`, { method: "POST" });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Analysis failed");
    }
    return res.json();
}

export async function getTraces(id: number): Promise<TraceStep[]> {
    const res = await fetch(`${API_BASE}/traces/${id}`);
    return res.json();
}

export async function notifyAutomation(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/automation/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function simulateTraffic(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulate`, { method: "POST" });
    return res.json();
}

import { useEffect, useState } from "react";
import { Ticket, AnalysisResult, analyzeTicket, getTicket, getTraces, TraceStep, notifyAutomation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TraceTimeline } from "@/components/TraceTimeline";
import { Play, Sparkles, AlertTriangle, CheckCircle, Activity, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TicketDetailProps {
    ticketId: number;
    onUpdate: () => void;
}

function TerminalView() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            "Initializing agent runtime...",
            "Loading knowledge base embeddings...",
            "Connecting to secure gateway...",
            "Analyzing ticket sentiment...",
            "Fetching recent logs from Splunk...",
            "Running heuristic analysis...",
            "Detecting anomalies in metrics...",
            "Formulating diagnostic plan...",
            "Drafting response...",
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setLines(prev => [...prev, `> ${logs[i]}`]);
                i++;
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-green-500 font-mono p-4 rounded-md h-[300px] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto space-y-1">
                {lines.map((line, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                        {line}
                    </div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>
    );
}

function JiraCard({ ticketId, onClick }: { ticketId: string, onClick: () => void }) {
    return (
        <div className="animate-in slide-in-from-right-10 duration-500">
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-2 rounded-md text-white">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-700 dark:text-blue-300">Jira Ticket Created</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">ID: {ticketId}</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300"
                        onClick={onClick}
                    >
                        View in Jira
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function JiraTicketModal({ open, onOpenChange, ticketId, ticket }: { open: boolean, onOpenChange: (open: boolean) => void, ticketId: string, ticket: Ticket }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white text-slate-900 border-none">
                {/* Mock Jira Header */}
                <div className="bg-[#0052CC] text-white p-3 flex items-center gap-4 shrink-0">
                    <div className="font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Jira Software
                    </div>
                    <div className="text-sm opacity-80">Projects / OPS / {ticketId}</div>
                </div>

                {/* Mock Jira Body */}
                <div className="flex-1 bg-white p-6 overflow-auto">
                    <div className="flex gap-2 mb-4">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Bug</Badge>
                        <Badge variant="outline" className="text-slate-700 border-slate-300">To Do</Badge>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-6">
                        {ticket.subject}
                    </h1>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Description</h3>
                                <div className="p-4 bg-slate-50 rounded-md text-sm whitespace-pre-wrap border border-slate-200 text-slate-900">
                                    {ticket.body}
                                    <br /><br />
                                    <strong>Automated Analysis:</strong><br />
                                    Ticket classified as <strong>{ticket.priority}</strong> priority.<br />
                                    See Ops Copilot trace for diagnostic details.
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Activity</h3>
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                                    <div className="text-sm text-slate-900">
                                        <span className="font-bold">Ops Copilot</span> created this issue via Automation.
                                        <div className="text-xs text-slate-400 mt-1">Just now</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 border border-slate-200 rounded-md space-y-4 bg-white">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Assignee</div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                        Unassigned
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Reporter</div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">AI</div>
                                        Ops Copilot
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Priority</div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        {ticket.priority}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function SlackPreviewModal({ open, onOpenChange, onConfirm, message }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void, message: string }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Slack Notification</DialogTitle>
                    <DialogDescription>
                        This message will be sent to the <strong>#ops-alerts</strong> channel via n8n.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap border border-border">
                    {message}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onConfirm}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Send Notification
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function N8nWorkflowModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (open) {
            setStep(0);
            const t1 = setTimeout(() => setStep(1), 500);
            const t2 = setTimeout(() => setStep(2), 1500);
            const t3 = setTimeout(() => setStep(3), 2500);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 overflow-hidden bg-[#222] text-white border-none [&>button]:hidden">
                {/* n8n Header */}
                <div className="bg-[#333] p-3 flex items-center justify-between shrink-0 border-b border-[#444]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#ff6d5a] rounded-md flex items-center justify-center font-bold text-white">n8n</div>
                        <div className="font-medium">Ops Copilot Notification Flow</div>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] p-10 flex items-center justify-center">

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="30%" y1="50%" x2="50%" y2="50%" stroke="#666" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="70%" y2="50%" stroke="#666" strokeWidth="2" />

                        {/* Animated Flow */}
                        {step >= 1 && <circle cx="40%" cy="50%" r="4" fill="#ff6d5a" className="animate-ping" />}
                        {step >= 2 && <circle cx="60%" cy="50%" r="4" fill="#ff6d5a" className="animate-ping" />}
                    </svg>

                    <div className="flex gap-20 items-center z-10 w-full justify-center">
                        {/* Node 1: Webhook */}
                        <div className={cn(
                            "w-40 h-24 bg-[#333] border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-500",
                            step >= 1 ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-[#555]"
                        )}>
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium">Webhook</span>
                        </div>

                        {/* Node 2: Format */}
                        <div className={cn(
                            "w-40 h-24 bg-[#333] border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-500",
                            step >= 2 ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-[#555]"
                        )}>
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="font-mono font-bold text-lg">{"{ }"}</span>
                            </div>
                            <span className="text-sm font-medium">Format Data</span>
                        </div>

                        {/* Node 3: Slack */}
                        <div className={cn(
                            "w-40 h-24 bg-[#333] border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-500",
                            step >= 3 ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-[#555]"
                        )}>
                            <div className="w-10 h-10 rounded-full bg-[#E01E5A] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium">Slack</span>
                        </div>
                    </div>

                    {/* Success Toast */}
                    {step >= 3 && (
                        <div className="absolute bottom-10 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-in slide-in-from-bottom-5 fade-in">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Workflow Executed Successfully</span>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function TicketDetail({ ticketId, onUpdate }: TicketDetailProps) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [traces, setTraces] = useState<TraceStep[]>([]);
    const [loading, setLoading] = useState(false);
    const [jiraId, setJiraId] = useState<string | null>(null);
    const [showSlackModal, setShowSlackModal] = useState(false);
    const [showJiraModal, setShowJiraModal] = useState(false);
    const [showN8nModal, setShowN8nModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [ticketId]);

    useEffect(() => {
        // Scan traces for Jira creation
        if (traces.length > 0) {
            const jiraTrace = traces.find(t => t.action.tool === "jiraTicket");
            if (jiraTrace) {
                // Extract ID from observation: "Created Jira Ticket: OPS-1234"
                const match = jiraTrace.observation.match(/OPS-\d+/);
                if (match) setJiraId(match[0]);
            } else {
                setJiraId(null);
            }
        } else {
            setJiraId(null);
        }
    }, [traces]);

    async function loadData() {
        const t = await getTicket(ticketId);
        setTicket(t);
        const existingTraces = await getTraces(ticketId);
        if (existingTraces.length > 0) {
            setTraces(existingTraces);
        } else {
            setTraces([]);
            setAnalysis(null);
        }
    }

    async function runAnalysis() {
        setLoading(true);
        setTraces([]);
        setJiraId(null);
        try {
            const res = await analyzeTicket(ticketId);
            setAnalysis(res);
            setTraces(res.traces || []);
            onUpdate();
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Check backend logs.");
        } finally {
            setLoading(false);
        }
    }

    if (!ticket) return <div>Loading...</div>;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                    <div className="flex gap-2 mt-2">
                        <Badge variant={ticket.status === "new" ? "default" : "secondary"}>{ticket.status}</Badge>
                        <Badge variant="outline">{ticket.category || "Unclassified"}</Badge>
                        <Badge variant={ticket.priority === "critical" ? "destructive" : "outline"}>{ticket.priority}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={runAnalysis} disabled={loading}>
                        {loading ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                        Run Analysis
                    </Button>
                </div>
            </div>

            {/* Body */}
            <Card>
                <CardContent className="pt-6">
                    <p className="whitespace-pre-wrap">{ticket.body}</p>
                </CardContent>
            </Card>

            {loading ? (
                <TerminalView />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Trace */}
                    <div className="flex flex-col gap-6">
                        <TraceTimeline traces={traces} isAnalyzing={loading} />
                        {jiraId && <JiraCard ticketId={jiraId} onClick={() => setShowJiraModal(true)} />}
                    </div>

                    {/* Right: Insights & Reply */}
                    <div className="space-y-6">
                        {analysis && (
                            <>
                                {/* Health */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            {analysis.anomaly.flag ? (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Anomaly Detected
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                                    <CheckCircle className="w-3 h-3" /> Healthy
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">Score: {analysis.anomaly.score.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Draft Reply */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Draft Reply</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            readOnly
                                            value={analysis.draftReply}
                                            className="h-[200px] font-mono text-sm"
                                        />
                                        <div className="mt-2 flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(analysis.draftReply)}>
                                                Copy to Clipboard
                                            </Button>
                                            <Button size="sm" onClick={() => setShowSlackModal(true)}>
                                                <Sparkles className="w-3 h-3 mr-2" />
                                                Notify via n8n
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <SlackPreviewModal
                                    open={showSlackModal}
                                    onOpenChange={setShowSlackModal}
                                    message={`Ticket: ${ticket.subject}\n\nSummary: ${analysis.summary}\n\nPriority: ${analysis.priority}`}
                                    onConfirm={async () => {
                                        await notifyAutomation({ ticket, analysis });
                                        setShowSlackModal(false);
                                        setShowN8nModal(true);
                                    }}
                                />

                                {jiraId && (
                                    <JiraTicketModal
                                        open={showJiraModal}
                                        onOpenChange={setShowJiraModal}
                                        ticketId={jiraId}
                                        ticket={ticket}
                                    />
                                )}

                                <N8nWorkflowModal
                                    open={showN8nModal}
                                    onOpenChange={setShowN8nModal}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

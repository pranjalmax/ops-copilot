import { useEffect, useState } from "react";
import { Ticket, getTickets } from "@/lib/api";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { SettingsPage } from "@/components/SettingsPage";
import { simulateTraffic } from "@/lib/api";
import { LayoutDashboard, Settings, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        loadTickets();
        // Auto-refresh every 5 seconds
        const interval = setInterval(loadTickets, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadTickets() {
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (e) {
            console.error("Failed to load tickets", e);
        }
    }

    async function handleSimulate() {
        setIsSimulating(true);
        try {
            await simulateTraffic();
            await loadTickets();
        } catch (e) {
            console.error(e);
        } finally {
            setTimeout(() => setIsSimulating(false), 500);
        }
    }

    if (showSettings) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <SettingsPage onClose={() => setShowSettings(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navbar */}
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="mr-4 flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        <LayoutDashboard className="text-purple-500" />
                        Ops Copilot
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSimulate}
                            disabled={isSimulating}
                            className={isSimulating ? "animate-pulse border-purple-500 text-purple-500" : ""}
                        >
                            <Activity className="h-4 w-4 mr-2" />
                            {isSimulating ? "Generating..." : "Simulate Traffic"}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container max-w-screen-2xl py-6 grid grid-cols-12 gap-6 h-[calc(100vh-3.5rem)]">
                {/* Left Sidebar: List */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-4 overflow-hidden h-full">
                    <AnalyticsDashboard tickets={tickets} />
                    <div className="flex-1 overflow-auto">
                        <TicketList
                            tickets={tickets}
                            selectedId={selectedTicketId}
                            onSelect={setSelectedTicketId}
                        />
                    </div>
                </div>

                {/* Right Content: Detail */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full overflow-auto">
                    {selectedTicketId ? (
                        <TicketDetail
                            ticketId={selectedTicketId}
                            onUpdate={loadTickets}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Select a ticket to view details
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;

import { Ticket } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TicketListProps {
    tickets: Ticket[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
    return (
        <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full border-r">
            <h2 className="text-xl font-bold mb-4">Tickets</h2>
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className={cn(
                        "p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors",
                        selectedId === ticket.id ? "bg-accent border-primary" : "bg-card"
                    )}
                    onClick={() => onSelect(ticket.id)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold truncate">{ticket.subject}</span>
                        <Badge variant={ticket.priority === "critical" ? "destructive" : "secondary"}>
                            {ticket.priority}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ticket.body}</p>
                    <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                        <span>#{ticket.id}</span>
                        <span>{new Date(ticket.created_at).toLocaleTimeString()}</span>
                        <Badge variant="outline" className="text-[10px] h-5">{ticket.category || "Unclassified"}</Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}

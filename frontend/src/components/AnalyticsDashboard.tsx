import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/lib/api";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface AnalyticsDashboardProps {
    tickets: Ticket[];
}

export function AnalyticsDashboard({ tickets }: AnalyticsDashboardProps) {
    // 1. Tickets by Priority
    const priorityData = [
        { name: "Low", value: tickets.filter(t => t.priority === "low").length, color: "#22c55e" },
        { name: "Medium", value: tickets.filter(t => t.priority === "medium").length, color: "#eab308" },
        { name: "High", value: tickets.filter(t => t.priority === "high").length, color: "#f97316" },
        { name: "Critical", value: tickets.filter(t => t.priority === "critical").length, color: "#ef4444" },
    ];

    // 2. Tickets by Category
    const categories = Array.from(new Set(tickets.map(t => t.category || "Unclassified")));
    const categoryData = categories.map(cat => ({
        name: cat,
        value: tickets.filter(t => t.category === cat).length
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tickets by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tickets by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

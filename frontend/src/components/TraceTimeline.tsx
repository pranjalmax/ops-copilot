import { TraceStep } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

interface TraceTimelineProps {
    traces: TraceStep[];
    isAnalyzing: boolean;
}

export function TraceTimeline({ traces, isAnalyzing }: TraceTimelineProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Agent Trace</h3>
            <div className="space-y-2">
                {(traces || []).map((trace, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <CardContent className="p-4 flex gap-3 items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">{trace.thought}</p>
                                    <div className="text-xs font-mono bg-muted p-2 rounded">
                                        <span className="text-blue-400">{trace.action.tool}</span>
                                        <span className="text-muted-foreground">({JSON.stringify(trace.action.args)})</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Observation: {trace.observation}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-muted-foreground p-2"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Agent is thinking...</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

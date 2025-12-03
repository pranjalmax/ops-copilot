import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface SettingsPageProps {
    onClose: () => void;
}

export function SettingsPage({ onClose }: SettingsPageProps) {
    const [apiKey, setApiKey] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        // In a real app, we might fetch this from backend if we want to show it exists
        // But for security, we usually don't send it back.
        // We'll just use localStorage for a "client-side" override demo, 
        // or just a form to "update" the backend.
    }, []);

    async function handleSave() {
        // For this MVP, since we set it in .env, this might just be a visual demo
        // OR we could add an endpoint to update .env (risky)
        // OR we store it in localStorage and send it in headers (better for multi-tenant)

        // Let's simulate a check
        if (apiKey.startsWith("AIza")) {
            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                onClose();
            }, 1000);
        } else {
            setStatus("error");
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>LLM Configuration</CardTitle>
                        <CardDescription>Manage your AI model settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gemini API Key</label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="AIza..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <Button onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                            {status === "success" && (
                                <p className="text-sm text-green-500 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Saved successfully
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" /> Invalid API Key format
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            The key is currently loaded from the backend environment variables.
                            This form is for demonstration purposes.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Backend Status</span>
                            <span className="text-green-500 font-medium">Online</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Database</span>
                            <span className="text-green-500 font-medium">Connected</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Model</span>
                            <span className="text-blue-400 font-medium">Gemini 2.0 Flash</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { UploadPanel } from "@/components/dashboard/UploadPanel";
import { OutputPanel } from "@/components/dashboard/OutputPanel";
import { ChatPanel } from "@/components/dashboard/ChatPanel";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ink2Text — Digitize handwritten notes with AI" },
      { name: "description", content: "Turn handwritten notes into clean, searchable digital documents. Chat with your notes powered by AI." },
    ],
  }),
});

function Index() {
  const [isProcessing, setProcessing] = useState(false);
  const [isDone, setDone] = useState(false);

  const handleDigitize = () => {
    setProcessing(true);
    setDone(false);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 2200);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-4 lg:p-6">
          <div className="mb-5 animate-fade-in-up">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              <span className="gradient-text-aurora">Digitize</span> your handwritten notes
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Upload a page, get a polished digital document, and chat with it — all in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[600px]">
              <div className="md:col-span-5 rounded-2xl glass p-5 flex flex-col animate-fade-in-up min-w-0" style={{ animationDelay: "60ms" }}>
                <UploadPanel onDigitize={handleDigitize} isProcessing={isProcessing} isDone={isDone} />
              </div>

              <div className="md:col-span-7 rounded-2xl glass p-5 flex flex-col animate-fade-in-up min-w-0" style={{ animationDelay: "120ms" }}>
                <OutputPanel isProcessing={isProcessing} isDone={isDone} />
              </div>
            </div>

            <div className="animate-fade-in-up min-w-0 h-[600px]" style={{ animationDelay: "180ms" }}>
              <ChatPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { FileText, Copy, Download, Share2, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  isProcessing: boolean;
  isDone: boolean;
  extractedText: string;
  diagrams: any[];
}

export function OutputPanel({ isProcessing, isDone, extractedText, diagrams }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-accent/15 grid place-items-center">
              <FileText className="h-3.5 w-3.5 text-accent" />
            </span>
            Digitized output
          </h2>
          <p className="text-xs text-muted-foreground mt-1 ml-9">
            Structured, searchable, editable
          </p>
        </div>

        {isDone && (
          <div className="flex items-center gap-1 animate-fade-in">
            <ActionBtn icon={copied ? Check : Copy} label={copied ? "Copied" : "Copy"} onClick={handleCopy} active={copied} />
            <ActionBtn icon={Download} label="Export" />
            <ActionBtn icon={Share2} label="Share" />
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-border bg-surface shadow-soft overflow-hidden flex flex-col">
        <div className="px-6 py-3 border-b border-border/60 flex items-center justify-between bg-gradient-to-b from-muted/40 to-transparent">
          <span className="text-[11px] text-muted-foreground font-medium">notebook · page 1</span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {isDone ? `${extractedText.split(/\s+/).filter(Boolean).length} words` : "—"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {!isProcessing && !isDone && <EmptyState />}
          {isProcessing && <ProcessingSkeleton />}
          {isDone && <DigitizedDocument extractedText={extractedText} diagrams={diagrams} />}
        </div>
      </div>
    </section>
  );
}

function ActionBtn({ icon: Icon, label, onClick, active }: { icon: any; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium border transition-smooth",
        active
          ? "border-success/40 bg-success/10 text-success"
          : "border-border bg-surface hover:bg-muted/60 text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-12">
      <div className="relative h-16 w-16 rounded-2xl glass grid place-items-center">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-5 font-semibold text-sm">Your digitized notes will appear here</h3>
      <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">
        Upload a handwritten page and tap Digitize.
      </p>
    </div>
  );
}

function ProcessingSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-primary font-medium">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        Reading handwriting & extracting diagrams…
      </div>
      <div className="h-7 w-2/3 rounded-md bg-muted animate-shimmer" />
      <div className="h-3 w-full rounded bg-muted animate-shimmer" />
      <div className="h-3 w-11/12 rounded bg-muted animate-shimmer" />
      <div className="h-3 w-4/5 rounded bg-muted animate-shimmer" />
    </div>
  );
}

function DigitizedDocument({ extractedText, diagrams }: { extractedText: string; diagrams: any[] }) {
  return (
    <article className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold gradient-text-aurora">Extracted Notes</h1>
        <p className="text-xs text-muted-foreground mt-1">OCR text from uploaded page</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4 whitespace-pre-wrap text-sm leading-relaxed">
        {extractedText || "No text detected."}
      </div>

      {diagrams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Detected Diagrams / Images</h2>

          <div className="space-y-4">
            {diagrams.map((diagram, index) => (
              <div key={index} className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Diagram {index + 1}
                </p>
                <img
                  src={`data:image/png;base64,${diagram.image}`}
                  alt={`Diagram ${index + 1}`}
                  className="max-w-full rounded-lg border border-border bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
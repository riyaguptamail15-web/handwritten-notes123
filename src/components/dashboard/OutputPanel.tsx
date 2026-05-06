import { FileText, Copy, Download, Share2, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  isProcessing: boolean;
  isDone: boolean;
}

export function OutputPanel({ isProcessing, isDone }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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
          <p className="text-xs text-muted-foreground mt-1 ml-9">Structured, searchable, editable</p>
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
        {/* "page" header */}
        <div className="px-6 py-3 border-b border-border/60 flex items-center justify-between bg-gradient-to-b from-muted/40 to-transparent">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-chart-4/60" style={{ background: "oklch(0.82 0.16 80)" }} />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">notebook · page 1</span>
          <span className="text-[11px] text-muted-foreground font-mono">{isDone ? "248 words" : "—"}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {!isProcessing && !isDone && <EmptyState />}
          {isProcessing && <ProcessingSkeleton />}
          {isDone && <DigitizedDocument />}
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
      <div className="relative">
        <div className="absolute inset-0 gradient-primary blur-2xl opacity-30 rounded-full" />
        <div className="relative h-16 w-16 rounded-2xl glass grid place-items-center">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
      </div>
      <h3 className="mt-5 font-semibold text-sm">Your digitized notes will appear here</h3>
      <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">
        Upload a handwritten page on the left and tap <span className="font-medium text-foreground">Digitize</span> to convert it into clean, editable text.
      </p>
    </div>
  );
}

function ProcessingSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-primary font-medium">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        Reading handwriting & extracting structure…
      </div>
      <div className="h-7 w-2/3 rounded-md bg-muted animate-shimmer" />
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded bg-muted animate-shimmer" />
        <div className="h-3 w-11/12 rounded bg-muted animate-shimmer" />
        <div className="h-3 w-4/5 rounded bg-muted animate-shimmer" />
      </div>
      <div className="h-5 w-1/3 rounded bg-muted animate-shimmer mt-6" />
      <div className="space-y-2.5">
        <div className="h-3 w-10/12 rounded bg-muted animate-shimmer" />
        <div className="h-3 w-9/12 rounded bg-muted animate-shimmer" />
        <div className="h-3 w-3/4 rounded bg-muted animate-shimmer" />
      </div>
    </div>
  );
}

function DigitizedDocument() {
  return (
    <article className="prose-sm max-w-none animate-fade-in-up space-y-5 leading-relaxed">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">98% confidence</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">Detected: Lecture notes</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight gradient-text-aurora">
        Photosynthesis — Light & Dark Reactions
      </h1>
      <p className="text-xs text-muted-foreground">Biology 201 · Prof. Hayes · March 14, 2026</p>

      <div className="h-px bg-gradient-to-r from-border via-border/60 to-transparent" />

      <h2 className="text-lg font-semibold mt-6">1. Overview</h2>
      <p className="text-sm text-foreground/90">
        Photosynthesis converts <strong>light energy</strong> into chemical energy stored in glucose.
        It happens in the <em>chloroplasts</em> of plant cells and proceeds in two linked stages.
      </p>

      <h2 className="text-lg font-semibold mt-6">2. Key stages</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span><strong>Light-dependent reactions</strong> — occur in the thylakoid membrane; produce ATP and NADPH.</span>
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span><strong>Calvin cycle</strong> — occurs in the stroma; uses ATP + NADPH to fix CO₂ into G3P.</span>
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span>Net equation: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground/90 text-[12px]">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</code></span>
        </li>
      </ul>

      <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">Margin note</p>
        <p className="text-sm text-foreground/90">Remember: <strong>NADPH</strong> is the reducing agent in the Calvin cycle — exam likely!</p>
      </div>
    </article>
  );
}

import { Bot, Send, Sparkles, User, Paperclip, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const seed: Message[] = [
  { id: 1, role: "ai", text: "Hi! I've read your note on photosynthesis. Ask me anything — I can summarize, generate flashcards, or quiz you." },
  { id: 2, role: "user", text: "Summarize the Calvin cycle in one line." },
  { id: 3, role: "ai", text: "The Calvin cycle uses ATP and NADPH from the light reactions to fix CO₂ into glucose precursors (G3P) inside the stroma — no light required directly." },
];

const suggestions = ["Make flashcards", "Quiz me on this", "Explain like I'm 12", "Translate to Spanish"];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: value }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        id: id + 1,
        role: "ai",
        text: "Great question! Based on your note: photosynthesis takes place in chloroplasts and produces glucose plus oxygen. Want a deeper breakdown of either stage?"
      }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <section className="flex flex-col h-full rounded-2xl border border-border bg-surface shadow-soft overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="relative">
          <div className="h-9 w-9 rounded-xl gradient-aurora grid place-items-center shadow-soft">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">Ask Inkwell</p>
          <p className="text-[11px] text-muted-foreground">Chat with your notes · always online</p>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground glass px-2 py-1 rounded-md">
          <Sparkles className="h-3 w-3 text-primary" /> GPT-4 Vision
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-[320px]">
        {messages.map((m, i) => (
          <Bubble key={m.id} message={m} delay={i * 40} />
        ))}
        {typing && (
          <div className="flex gap-2.5 items-end animate-fade-in">
            <Avatar role="ai" />
            <div className="rounded-2xl rounded-bl-md glass px-4 py-3 flex items-center gap-1">
              <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-2 pb-3 border-t border-border/60 bg-gradient-to-b from-transparent to-muted/30">
        <div className="flex gap-1.5 mb-2.5 overflow-x-auto no-scrollbar">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-smooth font-medium"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="relative flex items-center gap-2 rounded-xl border border-border bg-surface focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-smooth pl-3 pr-1.5 py-1.5 shadow-xs"
        >
          <button type="button" className="text-muted-foreground hover:text-foreground transition-smooth">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your note…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none py-1.5"
          />
          <button type="button" className="text-muted-foreground hover:text-foreground transition-smooth">
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "h-9 w-9 grid place-items-center rounded-lg gradient-primary text-primary-foreground transition-bounce shadow-soft",
              "hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Bubble({ message, delay }: { message: Message; delay: number }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn("flex gap-2.5 items-end animate-fade-in-up", isUser && "flex-row-reverse")}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Avatar role={message.role} />
      <div
        className={cn(
          "max-w-[78%] px-4 py-2.5 text-sm leading-relaxed shadow-xs",
          isUser
            ? "rounded-2xl rounded-br-md gradient-primary text-primary-foreground"
            : "rounded-2xl rounded-bl-md bg-muted/70 text-foreground border border-border/60"
        )}
      >
        {message.text}
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "ai" }) {
  return (
    <div className={cn(
      "h-7 w-7 rounded-lg grid place-items-center shrink-0 shadow-xs",
      role === "ai" ? "gradient-aurora text-primary-foreground" : "bg-foreground/10 text-foreground"
    )}>
      {role === "ai" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
      style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
    />
  );
}

import { Sparkles, FileText, Upload, MessageSquare, Settings, History, FolderOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Upload, label: "Digitize", active: true },
  { icon: FolderOpen, label: "My Notes" },
  { icon: History, label: "Recent" },
  { icon: MessageSquare, label: "Conversations" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 glass-strong">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border/60">
        <div className="relative h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm tracking-tight">Ink2Text</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes Digitizer</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group",
              item.active
                ? "bg-primary/10 text-foreground shadow-inset"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <item.icon className={cn("h-4 w-4 transition-smooth", item.active && "text-primary")} />
            <span>{item.label}</span>
            {item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
          </button>
        ))}

        <div className="pt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent files</p>
          <div className="space-y-1">
            {["Calculus notes.pdf", "Biology lab.jpg", "Meeting Mar 14.png"].map((f) => (
              <button key={f} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth">
                <FileText className="h-3.5 w-3.5" />
                <span className="truncate">{f}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-border/60 space-y-1">
        {bottomItems.map((item) => (
          <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="mt-3 p-3 rounded-xl gradient-aurora text-primary-foreground shadow-soft relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/15 blur-xl" />
          <p className="text-xs font-semibold relative">Upgrade to Pro</p>
          <p className="text-[11px] opacity-80 mt-0.5 relative">Unlimited pages & AI chats</p>
          <button className="mt-2 text-[11px] font-semibold bg-white/20 hover:bg-white/30 transition-smooth rounded-md px-2.5 py-1 relative">Upgrade →</button>
        </div>
      </div>
    </aside>
  );
}

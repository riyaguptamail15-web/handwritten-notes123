import { Search, Bell, Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-4 lg:px-6 border-b border-border/60 glass-strong sticky top-0 z-30">
      <div className="lg:hidden flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">Inkwell AI</span>
      </div>

      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-smooth" />
          <input
            placeholder="Search notes, conversations, or ask AI..."
            className="w-full h-10 pl-9 pr-16 rounded-xl bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition-smooth placeholder:text-muted-foreground"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border bg-surface px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={() => setDark((v) => !v)}
          className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-smooth">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <div className="ml-2 flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="h-9 w-9 rounded-full gradient-aurora grid place-items-center text-primary-foreground text-xs font-semibold shadow-soft">
            AS
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-semibold">Alex Stone</span>
            <span className="text-[10px] text-muted-foreground">Pro plan</span>
          </div>
        </div>
      </div>
    </header>
  );
}

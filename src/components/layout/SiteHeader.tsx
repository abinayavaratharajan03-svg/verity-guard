import { Link } from "@tanstack/react-router";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/workflow", label: "System Workflow" },
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy Policy" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`glass border-b transition-colors duration-300 ${
          scrolled ? "border-cyan-neon/20 bg-background/70 backdrop-blur-xl" : "border-white/5"
        }`}
      >
        {/* Top neon hairline */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-neon/60 to-transparent" />

        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:gap-6">
          {/* Logo + title */}
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl neon-border bg-background/60 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5 text-cyan-neon drop-shadow-[0_0_8px_oklch(0.87_0.16_200/0.9)]" />
              <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
              <span className="absolute -inset-1 rounded-xl bg-cyan-neon/0 blur-md transition group-hover:bg-cyan-neon/20" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-sm font-bold tracking-tight sm:text-base">
                Deepfake <span className="neon-text">Auditor</span>
              </span>
              <span className="truncate font-mono text-[9px] uppercase tracking-[0.28em] text-cyan-neon/80 sm:text-[10px]">
                Real-Time Video Deception
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 rounded-full glass-strong neon-border px-1.5 py-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
                activeProps={{
                  className:
                    "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground bg-cyan-neon shadow-[0_0_20px_oklch(0.87_0.16_200/0.45)]",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg neon-border bg-cyan-neon/10 px-4 py-2 text-sm font-medium text-cyan-neon transition hover:bg-cyan-neon hover:text-primary-foreground hover:shadow-[0_0_24px_oklch(0.87_0.16_200/0.55)]"
            >
              Launch Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              className="lg:hidden grid h-10 w-10 shrink-0 place-items-center rounded-lg neon-border bg-background/60 text-cyan-neon"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden overflow-hidden border-t border-white/5 transition-[max-height,opacity] duration-300 ${
            open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                activeProps={{
                  className:
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-cyan-neon bg-cyan-neon/10 neon-border",
                }}
              >
                <span>{n.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-50" />
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-neon px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_oklch(0.87_0.16_200/0.45)]"
            >
              Launch Console <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

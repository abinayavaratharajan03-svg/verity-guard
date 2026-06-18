import { Link } from "@tanstack/react-router";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analyze", label: "Analyze" },
  { to: "/kyc", label: "KYC" },
  { to: "/voice", label: "Voice" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative grid h-9 w-9 place-items-center rounded-lg neon-border bg-background/40">
              <ShieldCheck className="h-4.5 w-4.5 text-cyan-neon" />
              <span className="absolute inset-0 rounded-lg animate-pulse-ring" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight">DEEPFAKE</span>
              <span className="font-mono text-[10px] text-cyan-neon tracking-[0.25em]">AUDITOR</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-white/5 transition"
                activeProps={{ className: "px-3 py-1.5 text-sm text-cyan-neon rounded-md bg-cyan-neon/10" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className="px-4 py-2 text-sm font-medium rounded-md bg-cyan-neon text-primary-foreground hover:shadow-[0_0_24px_oklch(0.87_0.16_200/0.5)] transition">
              Launch Console
            </Link>
          </div>

          <button className="md:hidden text-foreground p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-white/5">
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

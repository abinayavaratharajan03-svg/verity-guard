import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function GlassCard({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("glass rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}

export function NeonButton({ className, children, variant = "primary", ...props }: ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "ghost" | "outline" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all";
  const styles = {
    primary: "bg-cyan-neon text-primary-foreground hover:shadow-[0_0_30px_oklch(0.87_0.16_200/0.55)] hover:-translate-y-0.5",
    outline: "neon-border bg-transparent text-cyan-neon hover:bg-cyan-neon/10",
    ghost: "glass text-foreground hover:bg-white/10",
  } as const;
  return <button className={cn(base, styles[variant], className)} {...props}>{children}</button>;
}

export function ScoreRing({ value, size = 160, label, sublabel }: { value: number; size?: number; label?: string; sublabel?: string }) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const off = c - (v / 100) * c;
  const color = v >= 75 ? "var(--lime-ok)" : v >= 50 ? "var(--cyan-neon)" : "var(--magenta-alert)";
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`grad-${size}-${v}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="var(--blue-electric)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.06)" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#grad-${size}-${v})`} strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.7,.2,1)", filter: `drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-bold neon-text" style={{ color }}>{v}<span className="text-base opacity-60">%</span></div>
          {label && <div className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>}
          {sublabel && <div className="text-[10px] text-muted-foreground">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}

export function StatTile({ label, value, hint, accent = "cyan" }: { label: string; value: ReactNode; hint?: string; accent?: "cyan" | "magenta" | "lime" | "blue" }) {
  const colors = {
    cyan: "text-cyan-neon",
    magenta: "text-[oklch(0.7_0.27_350)]",
    lime: "text-[oklch(0.88_0.22_130)]",
    blue: "text-[oklch(0.7_0.18_260)]",
  } as const;
  return (
    <GlassCard className="p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-display text-2xl font-bold", colors[accent])}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </GlassCard>
  );
}

export function RiskBadge({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const map = {
    low: { c: "bg-[oklch(0.88_0.22_130/0.15)] text-[oklch(0.88_0.22_130)] border-[oklch(0.88_0.22_130/0.4)]", label: "LOW RISK" },
    medium: { c: "bg-cyan-neon/10 text-cyan-neon border-cyan-neon/40", label: "MEDIUM" },
    high: { c: "bg-[oklch(0.78_0.2_50/0.15)] text-[oklch(0.82_0.2_50)] border-[oklch(0.82_0.2_50/0.4)]", label: "HIGH" },
    critical: { c: "bg-[oklch(0.7_0.27_350/0.15)] text-[oklch(0.78_0.27_350)] border-[oklch(0.78_0.27_350/0.5)] animate-pulse", label: "CRITICAL" },
  } as const;
  const m = map[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-widest", m.c)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function SectionHeading({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {kicker && <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-neon">{kicker}</div>}
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

import { Upload, Film, ScanFace, Cpu, Gauge, FileWarning } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const steps = [
  { icon: Upload, title: "Video Upload / Webcam", desc: "Ingest video or live feed via secure channel.", to: "/analyze" as const },
  { icon: Film, title: "Frame Extraction", desc: "Sample keyframes at 12–24 fps for analysis.", to: "/frame-extraction" as const },
  { icon: ScanFace, title: "Face Detection", desc: "Locate, align, and normalize facial regions.", to: "/face-detection" as const },
  { icon: Cpu, title: "AI Analysis Engine", desc: "Multi-model ensemble inspects spatial + temporal signals.", to: "/ai-analysis" as const },
  { icon: Gauge, title: "Authenticity Score", desc: "Aggregate confidence into a 0–100 score.", to: "/analyze" as const },
  { icon: FileWarning, title: "Risk Report", desc: "Generate auditable report with evidence overlays.", to: "/risk-report" as const },
];

export function WorkflowFlow() {
  return (
    <div className="mt-12 relative">
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-cyan-neon/40 to-transparent hidden md:block" />
      <ol className="space-y-6 md:space-y-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const right = i % 2 === 1;
          return (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:items-center`}
            >
              <Link to={s.to} className={`glass rounded-xl p-5 block group hover:neon-border transition ${right ? "md:order-3" : "md:text-right"}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-neon">Step {String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-cyan-neon transition">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan-neon opacity-70 group-hover:opacity-100">Open stage →</div>
              </Link>
              <div className="hidden md:grid place-items-center md:order-2">
                <Link to={s.to} className="relative grid h-12 w-12 place-items-center rounded-full neon-border bg-background hover:bg-cyan-neon/10 transition">
                  <Icon className="h-5 w-5 text-cyan-neon" />
                  <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                </Link>
              </div>
              <div className={`hidden md:block ${right ? "md:order-1" : "md:order-3"}`} />
              <div className="md:hidden mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full neon-border bg-background"><Icon className="h-4 w-4 text-cyan-neon" /></div>
                <div className="h-px flex-1 bg-cyan-neon/30" />
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

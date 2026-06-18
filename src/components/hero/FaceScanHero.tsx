import { motion } from "framer-motion";

export function FaceScanHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-neon/15" />
      <div className="absolute inset-6 rounded-full border border-cyan-neon/10" />
      <div className="absolute inset-12 rounded-full border border-dashed border-cyan-neon/20 animate-[spin_24s_linear_infinite]" />

      {/* Face SVG */}
      <div className="absolute inset-16 rounded-full glass-strong overflow-hidden scan-line">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="face-fade" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="oklch(0.87 0.16 200 / 0.35)" />
              <stop offset="100%" stopColor="oklch(0.13 0.03 260 / 0)" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#face-fade)" />
          {/* Face mesh */}
          <g stroke="oklch(0.87 0.16 200 / 0.6)" strokeWidth="0.6" fill="none">
            <ellipse cx="100" cy="105" rx="48" ry="62" />
            <path d="M55 95 Q100 70 145 95" />
            <path d="M52 110 Q100 130 148 110" />
            <path d="M70 80 Q100 90 130 80" />
            <ellipse cx="80" cy="98" rx="8" ry="4" />
            <ellipse cx="120" cy="98" rx="8" ry="4" />
            <circle cx="80" cy="98" r="2" fill="oklch(0.87 0.16 200)" />
            <circle cx="120" cy="98" r="2" fill="oklch(0.87 0.16 200)" />
            <path d="M88 135 Q100 142 112 135" />
            <line x1="100" y1="105" x2="100" y2="125" />
            <path d="M100 125 Q97 128 100 130" />
          </g>
          {/* Mesh points */}
          {Array.from({ length: 32 }).map((_, i) => {
            const a = (i / 32) * Math.PI * 2;
            const x = 100 + Math.cos(a) * 55;
            const y = 105 + Math.sin(a) * 65;
            return <circle key={i} cx={x} cy={y} r="1.2" fill="oklch(0.87 0.16 200)" opacity="0.7" />;
          })}
        </svg>

        {/* Scan line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-neon to-transparent shadow-[0_0_24px_4px_oklch(0.87_0.16_200/0.6)] animate-scan-y" />

        {/* Corner brackets */}
        {[["top-2 left-2", "border-t-2 border-l-2"], ["top-2 right-2", "border-t-2 border-r-2"], ["bottom-2 left-2", "border-b-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"]].map(([pos, b]) => (
          <div key={pos} className={`absolute ${pos} h-5 w-5 ${b} border-cyan-neon`} />
        ))}
      </div>

      {/* Floating chips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="absolute -left-2 top-12 glass rounded-lg px-3 py-2 font-mono text-[10px] animate-float-y">
        <div className="text-muted-foreground">FACE_ID</div>
        <div className="text-cyan-neon">0x9F:A2:18:CC</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="absolute -right-4 top-24 glass rounded-lg px-3 py-2 font-mono text-[10px] animate-float-y" style={{ animationDelay: "1.2s" }}>
        <div className="text-muted-foreground">AUTHENTICITY</div>
        <div className="text-[oklch(0.88_0.22_130)]">97.4%</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="absolute -left-6 bottom-16 glass rounded-lg px-3 py-2 font-mono text-[10px] animate-float-y" style={{ animationDelay: "0.6s" }}>
        <div className="text-muted-foreground">GAN_ARTIFACT</div>
        <div className="text-[oklch(0.78_0.27_350)]">2.6%</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="absolute -right-2 bottom-8 glass rounded-lg px-3 py-2 font-mono text-[10px] animate-float-y" style={{ animationDelay: "1.8s" }}>
        <div className="text-muted-foreground">LIVENESS</div>
        <div className="text-cyan-neon">VERIFIED</div>
      </motion.div>
    </div>
  );
}

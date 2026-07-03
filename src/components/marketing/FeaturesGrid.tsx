import { Video, Webcam, Activity, ScanFace, IdCard, AudioLines, BellRing, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/primitives";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const features = [
  { icon: Video, title: "Deepfake Video Detection", desc: "Frame-level neural inspection identifies synthetic faces, face-swaps, and reenactments.", to: "/analyze" as const },
  { icon: Webcam, title: "Live Webcam Analysis", desc: "Stream live video and surface authenticity drift before it reaches your customer.", to: "/dashboard" as const },
  { icon: Activity, title: "Real-Time Authenticity Scoring", desc: "Continuous confidence telemetry with sub-second risk classification.", to: "/dashboard" as const },
  { icon: ScanFace, title: "Manipulated Area Visualization", desc: "Heatmaps pinpoint tampered facial regions and synthesized artifacts.", to: "/analyze" as const },
  { icon: IdCard, title: "KYC Verification", desc: "Match ID documents to live captures with fraud-risk scoring built in.", to: "/kyc" as const },
  { icon: AudioLines, title: "Voice Clone Detection", desc: "Spectral fingerprinting catches AI-generated voice impersonation.", to: "/voice" as const },
  { icon: BellRing, title: "Security Alert Dashboard", desc: "Realtime feed of suspicious events, severity tiers, and actionable signals.", to: "/dashboard" as const },
];

export function FeaturesGrid() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={f.to} className="block h-full">
              <GlassCard className="group relative h-full overflow-hidden p-6 transition hover:-translate-y-1 hover:neon-border cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/0 via-transparent to-blue-electric/0 group-hover:from-cyan-neon/10 group-hover:to-blue-electric/10 transition" />
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-cyan-neon opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-lg glass-strong neon-border">
                    <Icon className="h-5 w-5 text-cyan-neon" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan-neon">Open module →</div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

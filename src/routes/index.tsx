import { createFileRoute, Link } from "@tanstack/react-router";
import { FaceScanHero } from "@/components/hero/FaceScanHero";
import { NeonButton, SectionHeading } from "@/components/ui/primitives";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { WorkflowFlow } from "@/components/marketing/WorkflowFlow";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deepfake Auditor — Real-Time Video Deception & Deepfake Detection" },
      { name: "description", content: "AI-Powered Deepfake Detection & Identity Verification Platform. Detect synthetic media, voice cloning, and KYC fraud in real time." },
      { property: "og:title", content: "Deepfake Auditor — Real-Time Video Deception & Deepfake Detection" },
      { property: "og:description", content: "AI-Powered Deepfake Detection & Identity Verification Platform. Detect synthetic media, voice cloning, and KYC fraud in real time." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-neon" />
              <span className="text-muted-foreground">AI · CYBERSECURITY · TRUST LAYER</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Real-Time Video <span className="neon-text">Deception</span> & Deepfake <span className="neon-text">Auditor</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-xl text-lg text-muted-foreground">
              AI-Powered Deepfake Detection & Identity Verification Platform — built for banks, fintechs, and digital-identity teams that cannot afford to be fooled.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/analyze"><NeonButton>Analyze Video <ArrowRight className="h-4 w-4" /></NeonButton></Link>
              <Link to="/dashboard"><NeonButton variant="outline"><PlayCircle className="h-4 w-4" />Live Detection</NeonButton></Link>
              <Link to="/about"><NeonButton variant="ghost">Learn More</NeonButton></Link>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 max-w-md gap-3">
              {[["99.2%", "Detection Accuracy"], ["<420ms", "Median Latency"], ["12M+", "Frames Audited"]].map(([v, l]) => (
                <div key={l} className="glass rounded-lg p-3">
                  <div className="font-display text-xl font-bold text-cyan-neon">{v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <FaceScanHero />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeading kicker="Capabilities" title="A complete trust-layer for synthetic media" sub="Seven detection surfaces working in concert to protect every customer interaction." />
        <FeaturesGrid />
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeading kicker="System Pipeline" title="From frame to forensic report" sub="Every video traverses six audited stages before a verdict is rendered." />
        <WorkflowFlow />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center">
          <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Deploy real-time digital trust.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Launch the audit console and run a deepfake scan in under a minute.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard"><NeonButton>Open Console <ArrowRight className="h-4 w-4" /></NeonButton></Link>
              <Link to="/about"><NeonButton variant="outline">View Architecture</NeonButton></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

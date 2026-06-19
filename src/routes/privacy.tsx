import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, SectionHeading, NeonButton } from "@/components/ui/primitives";
import {
  ShieldCheck,
  EyeOff,
  Camera,
  Cookie,
  Fingerprint,
  UserRoundCheck,
  Mail,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Deepfake Auditor" },
      { name: "description", content: "How Deepfake Auditor handles media you submit for analysis, what we store, and your rights." },
      { property: "og:title", content: "Privacy Policy — Deepfake Auditor" },
      { property: "og:description", content: "Our approach to data handling and user privacy." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    icon: ShieldCheck,
    h: "Overview",
    p: "This page describes how the Deepfake Auditor demo handles content you submit. It is maintained by the project owner and answers common privacy questions about the application.",
  },
  {
    icon: EyeOff,
    h: "Media you upload",
    p: "Videos, images, and audio uploaded in this demo are processed entirely in your browser. They are not sent to a backend, are not retained between sessions, and are discarded as soon as you close or refresh the page.",
  },
  {
    icon: Camera,
    h: "Webcam and microphone",
    p: "Live capture features request access to your camera and microphone only after you click the corresponding control. Streams are processed locally for visualization; no frames or audio are uploaded.",
  },
  {
    icon: Cookie,
    h: "Analytics & cookies",
    p: "This demo does not set advertising cookies and does not track individual users. Standard hosting logs (IP address, user agent) may be retained by the hosting provider for short periods for operational and security purposes.",
  },
  {
    icon: Fingerprint,
    h: "Identity documents (KYC demo)",
    p: "The KYC flow is a UI demonstration. Document images you select stay in your browser and are never uploaded or matched against any external database.",
  },
  {
    icon: UserRoundCheck,
    h: "Your rights",
    p: "Because no personal data is collected by this demo, there is nothing to export or delete on our side. If you embed this software in a production deployment, you are responsible for honoring applicable data-subject rights (GDPR, DPDP, CCPA, etc.).",
  },
  {
    icon: Mail,
    h: "Contact",
    p: "For questions about this notice or to report a security concern, contact the project owner via the address listed on the About page.",
  },
];

function PrivacyPage() {
  return (
    <section className="relative isolate mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-28">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-neon/10 blur-[100px]" />
        <div className="absolute bottom-20 right-0 h-72 w-72 bg-blue-electric/10 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      {/* Hero intro */}
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-cyan-neon neon-border">
          <ShieldCheck className="h-4 w-4" />
          Trust & Transparency
        </div>
        <SectionHeading
          kicker="Legal"
          title="Privacy Policy"
          sub="How Deepfake Auditor treats the media, webcam streams, and identity documents you submit. Your data stays in your browser.">
        </SectionHeading>
      </div>

      {/* Policy cards */}
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <GlassCard
              key={s.h}
              className="group relative p-6 transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_oklch(0.87_0.16_200/0.35)]"
            >
              <span className="pointer-events-none absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-cyan-neon/10 text-xs font-bold text-cyan-neon neon-border">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-neon/10 text-cyan-neon neon-border transition group-hover:shadow-[0_0_20px_oklch(0.87_0.16_200/0.45)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cyan-neon">{s.h}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.p}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Data-handling summary band */}
      <GlassCard className="mt-8 flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
        <div className="text-center md:text-left">
          <h4 className="font-display font-semibold text-foreground">No data leaves your device</h4>
          <p className="text-sm text-muted-foreground">
            All analysis in this demo runs locally. We do not collect, store, or sell your data.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs font-mono uppercase tracking-wider text-cyan-neon">
          <span className="rounded-full glass px-3 py-1">No cloud upload</span>
          <span className="rounded-full glass px-3 py-1">No persistent storage</span>
          <span className="rounded-full glass px-3 py-1">No tracking cookies</span>
        </div>
      </GlassCard>

      {/* Last updated & CTA */}
      <div className="mt-12 flex flex-col items-center justify-center gap-6 text-center">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          Last updated · June 2026
        </p>
        <Link to="/about">
          <NeonButton className="inline-flex items-center gap-2">
            Learn more about the project <ArrowRight className="h-4 w-4" />
          </NeonButton>
        </Link>
      </div>
    </section>
  );
}

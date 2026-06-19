import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading, GlassCard } from "@/components/ui/primitives";

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
    h: "Overview",
    p: "This page describes how the Deepfake Auditor demo handles content you submit. It is maintained by the project owner and is intended to answer common privacy questions about the application.",
  },
  {
    h: "Media you upload",
    p: "Videos, images, and audio uploaded in this demo are processed entirely in your browser. They are not sent to a backend, are not retained between sessions, and are discarded as soon as you close or refresh the page.",
  },
  {
    h: "Webcam and microphone",
    p: "Live capture features request access to your camera and microphone only after you click the corresponding control. Streams are processed locally for visualization; no frames or audio are uploaded.",
  },
  {
    h: "Analytics & cookies",
    p: "This demo does not set advertising cookies and does not track individual users. Standard hosting logs (IP address, user agent) may be retained by the hosting provider for short periods for operational and security purposes.",
  },
  {
    h: "Identity documents (KYC demo)",
    p: "The KYC flow is a UI demonstration. Document images you select stay in your browser and are never uploaded or matched against any external database.",
  },
  {
    h: "Your rights",
    p: "Because no personal data is collected by this demo, there is nothing to export or delete on our side. If you embed this software in a production deployment, you are responsible for honoring applicable data-subject rights (GDPR, DPDP, CCPA, etc.).",
  },
  {
    h: "Contact",
    p: "For questions about this notice or to report a security concern, contact the project owner via the address listed on the About page.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24">
      <SectionHeading
        kicker="Legal"
        title="Privacy Policy"
        sub="What we collect, what we don't, and how this demo treats the media you submit."
      />
      <div className="mt-10 space-y-4">
        {sections.map((s) => (
          <GlassCard key={s.h} className="p-6">
            <h3 className="font-display text-lg font-semibold text-cyan-neon">{s.h}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.p}</p>
          </GlassCard>
        ))}
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest text-center pt-4">
          Last updated · June 2026
        </p>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading, NeonButton, GlassCard } from "@/components/ui/primitives";
import { WorkflowFlow } from "@/components/marketing/WorkflowFlow";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "System Workflow — Deepfake Auditor" },
      { name: "description", content: "From Pixel to Verdict — the six-stage pipeline that turns raw media into an auditable trust decision." },
      { property: "og:title", content: "System Workflow — Deepfake Auditor" },
      { property: "og:description", content: "From Pixel to Verdict — the audited pipeline." },
    ],
  }),
  component: WorkflowPage,
});

function WorkflowPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
      <SectionHeading
        kicker="System Pipeline"
        title="From Pixel to Verdict"
        sub="Every video, image, and audio sample travels six audited stages before a verdict is rendered — each stage produces signed evidence."
      />

      <WorkflowFlow />

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-semibold">How it works internally</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Media enters through the ingestion layer (upload, webcam, or audio capture). Frames are extracted with OpenCV, faces are detected and aligned with MediaPipe, and a multi-model ensemble inspects spatial, temporal, and spectral signals. Outputs are fused into a single authenticity score, classified into a risk band, and serialized into a forensic report.
          </p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-semibold">Why this pipeline</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Banks, fintechs, and identity providers need decisions they can defend. Each stage is independently observable, every artifact is fingerprinted, and every verdict ships with the evidence chain that produced it — so compliance, ops, and engineering all see the same source of truth.
          </p>
        </GlassCard>
      </div>

      <div className="mt-16 glass-strong rounded-2xl p-8 text-center">
        <h3 className="font-display text-2xl font-bold">See the pipeline run live</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard"><NeonButton>Open Console <ArrowRight className="h-4 w-4" /></NeonButton></Link>
          <Link to="/analyze"><NeonButton variant="outline">Run an Analysis</NeonButton></Link>
        </div>
      </div>
    </div>
  );
}

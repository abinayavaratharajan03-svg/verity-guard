import { ShieldCheck, Github, Twitter, Globe } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-neon/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg neon-border bg-background/40">
              <ShieldCheck className="h-4.5 w-4.5 text-cyan-neon" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold">DEEPFAKE AUDITOR</span>
              <span className="font-mono text-[10px] text-cyan-neon tracking-[0.25em]">AI · SECURITY · TRUST</span>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            AI-Powered Security Intelligence. Real-Time Digital Trust Protection for banks, fintechs, and identity verification providers.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-cyan-neon">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Deepfake Detection</li>
            <li>Voice Clone Analysis</li>
            <li>KYC Verification</li>
            <li>Live Webcam Audit</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-cyan-neon">Connect</h4>
          <div className="mt-3 flex gap-3">
            <a className="grid h-9 w-9 place-items-center rounded-md glass hover:neon-border transition" href="#"><Github className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-md glass hover:neon-border transition" href="#"><Twitter className="h-4 w-4" /></a>
            <a className="grid h-9 w-9 place-items-center rounded-md glass hover:neon-border transition" href="#"><Globe className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Deepfake Auditor. All signals secured.</span>
          <span className="font-mono">SYSTEM · ONLINE · <span className="text-lime-ok">●</span></span>
        </div>
      </div>
    </footer>
  );
}

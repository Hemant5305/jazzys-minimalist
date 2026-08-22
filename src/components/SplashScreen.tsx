import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "flicker" | "exit">("enter");

  useEffect(() => {
    // Phase 1: name enters (0-0.8s)
    // Phase 2: flicker on "Beauty" (0.8-2.2s)
    // Phase 3: fade out and reveal site (2.2-3s)
    const flickerTimer = setTimeout(() => setPhase("flicker"), 800);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(flickerTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${
        phase === "exit" ? "splash-fade-out" : ""
      }`}
      style={{
        background:
          "linear-gradient(160deg, #fff5f7 0%, #fef6f0 50%, #fff8f5 100%)",
      }}
    >
      <div
        className={`flex flex-col items-center gap-4 ${
          phase === "enter" ? "splash-name-enter" : ""
        }`}
      >
        <h1 className="text-center">
          <span className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tight text-foreground">
            Jazzy's
          </span>
        </h1>

        <div className="flex items-center gap-3">
          <span className="block h-[1px] w-10 bg-[#c96b8b]/30" />
          <p className="text-[13px] font-light uppercase tracking-[0.25em] text-[#888]">
            Salon &amp;{" "}
            <span className="splash-flicker font-medium text-[#c96b8b]">
              Beauty
            </span>
          </p>
          <span className="block h-[1px] w-10 bg-[#c96b8b]/30" />
        </div>
      </div>
    </div>
  );
}

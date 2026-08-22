import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"name" | "reveal" | "done">("name");

  useEffect(() => {
    // Phase 1: show name on black (0-1.4s)
    // Phase 2: curtain lifts (1.4-2.4s)
    // Phase 3: done (2.4s)
    const revealTimer = setTimeout(() => setPhase("reveal"), 1400);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* The actual site content sits underneath — not rendered here, but the splash covers it */}

      {/* Black curtain that lifts upward to reveal the site */}
      <div
        className={`absolute inset-0 bg-black ${
          phase === "reveal" ? "splash-curtain-lift" : ""
        }`}
        style={{
          transformOrigin: "top",
        }}
      >
        {/* Salon name centered on the black curtain */}
        <div className="flex h-full flex-col items-center justify-center">
          <div
            className={`text-center ${
              phase === "reveal" ? "splash-name-hold" : "splash-name-enter"
            }`}
          >
            <h1 className="text-4xl font-light tracking-[0.15em] text-white md:text-6xl">
              Jazzy's
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="block h-[1px] w-8 bg-white/30" />
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
                Salon & Beauty
              </p>
              <span className="block h-[1px] w-8 bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* During reveal, the name stays pinned in the viewport above the curtain */}
      {phase === "reveal" && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="splash-name-pin">
            <h1 className="text-4xl font-light tracking-[0.15em] text-white md:text-6xl">
              Jazzy's
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="block h-[1px] w-8 bg-white/30" />
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
                Salon & Beauty
              </p>
              <span className="block h-[1px] w-8 bg-white/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

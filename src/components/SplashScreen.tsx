import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("show"), 100);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${
        phase === "exit" ? "splash-exit" : ""
      }`}
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(201,107,139,0.15) 0%, rgba(201,107,139,0.05) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-5">
        {/* Logo icon */}
        <div className="splash-fade-in flex size-14 items-center justify-center rounded-full bg-[#c96b8b]/10">
          <Sparkles className="size-6 text-[#c96b8b]" />
        </div>

        {/* Salon name */}
        <div className="splash-delay-1 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Jazzy's
          </h1>
          <p className="mt-0.5 text-lg font-light tracking-wide text-[#c96b8b]">
            Salon & Beauty
          </p>
        </div>

        {/* Decorative line */}
        <div className="splash-delay-2 flex flex-col items-center gap-2">
          <div className="splash-line h-[1px] bg-[#c96b8b]/30" />
          <p className="splash-delay-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#999]">
            Where beauty meets elegance
          </p>
        </div>
      </div>
    </div>
  );
}

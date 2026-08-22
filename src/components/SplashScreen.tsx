import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "flicker" | "exit">("enter");

  useEffect(() => {
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
        phase === "exit" ? "splash-fade-out" : ""
      }`}
      style={{ backgroundColor: "#faf9f7" }}
    >
      <div
        className={`flex flex-col items-center gap-5 ${
          phase === "enter" ? "splash-name-enter" : ""
        }`}
      >
        <h1 className="text-center">
          <span
            className={`font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tight text-[#1a1a1a] ${
              phase === "flicker" ? "splash-flicker" : ""
            }`}
          >
            Jazzy's
          </span>
        </h1>

        <div className="flex items-center gap-3">
          <span className="block h-[1px] w-10 bg-[#ccc]" />
          <p className="text-[12px] font-light uppercase tracking-[0.3em] text-[#999]">
            Salon &amp; Beauty
          </p>
          <span className="block h-[1px] w-10 bg-[#ccc]" />
        </div>
      </div>
    </div>
  );
}

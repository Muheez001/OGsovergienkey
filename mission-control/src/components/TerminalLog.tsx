"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Terminal, Cpu, Radio } from "lucide-react";

interface TerminalLogProps {
  logs: string[];
}

function getLogColor(log: string): string {
  if (log.includes("✅") || log.includes("SUCCESS") || log.includes("confirmed")) return "#10B981";
  if (log.includes("❌") || log.includes("ERROR") || log.includes("FATAL")) return "#F43F5E";
  if (log.includes(">>") || log.includes("WARN") || log.includes("⚠️")) return "#F59E0B";
  if (log.includes("[0G]")) return "#A78BFA";
  if (log.includes("[ZK]")) return "#00F5D4";
  if (log.includes("[SAK]")) return "rgba(0, 245, 212, 0.9)";
  return "rgba(255, 255, 255, 0.45)";
}

export function TerminalLog({ logs }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="relative flex flex-col min-h-[450px] h-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8, 8, 14, 0.98)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Dot-grid ambient background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(139,92,246,0.8) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.5)] to-transparent" />

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 relative z-10"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-1.5 rounded-lg"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <Terminal className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[rgba(255,255,255,0.7)]">
            Orchestration Log
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3" style={{ color: "#00F5D4" }} />
          <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: "#00F5D4" }}>
            Live Stream
          </span>
        </div>
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        className="flex-1 px-5 py-4 font-mono text-[10px] leading-relaxed overflow-y-auto flex flex-col gap-2 relative z-10"
        style={{ scrollBehavior: "smooth" }}
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-[rgba(255,255,255,0.08)]">
            <Cpu size={28} className="animate-pulse" />
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold">Awaiting ZK intent events...</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <motion.div
              key={`${i}-${log.slice(0, 15)}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 items-start"
            >
              <span className="text-[rgba(255,255,255,0.15)] font-bold shrink-0 min-w-[20px] select-none tabular-nums">
                {i.toString().padStart(2, "0")}
              </span>
              <span className="break-all leading-relaxed" style={{ color: getLogColor(log) }}>
                {log}
              </span>
            </motion.div>
          ))
        )}

        {/* Blinking cursor */}
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
          className="w-1.5 h-3.5 mt-1 rounded-[2px]"
          style={{ background: "#8B5CF6", boxShadow: "0 0 8px rgba(139,92,246,0.6)" }}
        />
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between text-[8px] font-mono text-[rgba(255,255,255,0.12)] relative z-10"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}
      >
        <span className="tracking-widest uppercase">stdout · active</span>
        <span className="flex items-center gap-1.5">
          <Cpu size={8} />
          0G-GALILEO
        </span>
      </div>
    </div>
  );
}

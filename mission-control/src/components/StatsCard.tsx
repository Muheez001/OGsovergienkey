"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

interface StatsCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: ReactNode;
  trend?: string;
  status?: "online" | "loading" | "offline";
  trendColor?: string;
  history?: number[];
}

export function StatsCard({ title, value, label, icon, trend, status = "online", trendColor, history }: StatsCardProps) {
  const statusColor = status === "online" ? "#10B981" : status === "loading" ? "#F59E0B" : "#F43F5E";
  const statusLabel = status === "online" ? "LIVE" : status === "loading" ? "SYNCING" : "OFFLINE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative p-6 rounded-2xl overflow-hidden group"
      style={{
        background: "rgba(16, 16, 26, 0.97)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 40px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(0, 245, 212, 0.1)" }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,212,0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        {/* Icon */}
        <div
          className="p-2.5 rounded-xl transition-all duration-300"
          style={{
            background: "rgba(0, 245, 212, 0.06)",
            border: "1px solid rgba(0, 245, 212, 0.1)",
            color: "rgba(0, 245, 212, 0.7)",
          }}
        >
          {icon}
        </div>

        {/* Status pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: `${statusColor}10`,
            border: `1px solid ${statusColor}25`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
          />
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10">
        <h3 className="text-[10px] text-[rgba(255,255,255,0.35)] font-bold uppercase tracking-[0.15em] mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="text-[2rem] font-bold tracking-tight leading-none"
            style={{ color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </span>
          <span className="text-xs text-[rgba(255,255,255,0.4)] font-medium">{label}</span>
        </div>
        {trend && (
          <p
            className="text-[10px] font-medium tracking-wide"
            style={{ color: trendColor ? undefined : "rgba(0, 245, 212, 0.7)" }}
          >
            <span className={trendColor}>{trend}</span>
          </p>
        )}
      </div>

      {/* Sparkline */}
      {history && history.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden pointer-events-none opacity-25">
          <svg
            viewBox={`0 0 ${history.length - 1} 100`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,245,212,0.3)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#sparkGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={history.map((val, i) => `${i},${100 - (val / Math.max(...history)) * 80}`).join(" ")}
            />
          </svg>
        </div>
      )}

      {/* Ambient glow */}
      <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[rgba(0,245,212,0.03)] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
}

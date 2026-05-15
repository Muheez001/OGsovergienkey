"use client";

import { motion } from "framer-motion";
import { Copy, ShieldCheck, Cpu, User, ExternalLink } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AgentCardProps {
  name: string;
  id: string;
  rootHash: string;
  pubKeyHash?: string;
  owner?: string;
  zkStatus: "Verified" | "Pending" | "Failed";
  txHash?: string;
  className?: string;
  onClick?: () => void;
}

export function AgentCard({ name, id, rootHash, pubKeyHash, owner, zkStatus, txHash, className, onClick }: AgentCardProps) {
  const { address } = useAccount();
  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        "relative p-5 rounded-2xl flex flex-col gap-4 group cursor-pointer overflow-hidden",
        "bg-[rgba(16,16,26,0.97)] border border-[rgba(255,255,255,0.05)]",
        "hover:border-[rgba(0,245,212,0.18)] transition-all duration-300",
        "shadow-[0_4px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(0,245,212,0.05)]",
        className
      )}
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,212,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Corner bracket accent */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[rgba(0,245,212,0)] group-hover:border-[rgba(0,245,212,0.5)] transition-all duration-300 rounded-tl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[rgba(0,245,212,0)] group-hover:border-[rgba(0,245,212,0.5)] transition-all duration-300 rounded-br-lg" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3">
          {/* Agent Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(0,245,212,0.1)] to-[rgba(139,92,246,0.1)] flex items-center justify-center border border-[rgba(0,245,212,0.2)] group-hover:border-[rgba(0,245,212,0.35)] transition-colors flex-shrink-0">
            <Cpu className="w-5 h-5 text-[#00F5D4]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2 flex-wrap">
              <span className="truncate max-w-[140px]">{name}</span>
              {isOwner && (
                <span className="px-1.5 py-0.5 rounded-md bg-[rgba(139,92,246,0.15)] text-[#A78BFA] text-[9px] font-bold uppercase tracking-tight flex items-center gap-1 flex-shrink-0 border border-[rgba(139,92,246,0.2)]">
                  <User size={8} /> YOU
                </span>
              )}
            </h3>
            <p className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-widest font-mono mt-0.5">{id}</p>
          </div>
        </div>

        {/* ZK Status Badge */}
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 flex-shrink-0",
          zkStatus === "Verified"
            ? "bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.2)]"
            : zkStatus === "Pending"
            ? "bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]"
            : "bg-[rgba(244,63,94,0.1)] text-[#F43F5E] border border-[rgba(244,63,94,0.2)]"
        )}>
          {zkStatus === "Verified" && <ShieldCheck className="w-3 h-3" />}
          {zkStatus}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3">
        {/* Memory Root */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] text-[rgba(255,255,255,0.35)] uppercase tracking-widest font-semibold">Memory Root (0G DA)</span>
          <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-2 group-hover:border-[rgba(0,245,212,0.15)] transition-colors">
            <span className="text-[11px] font-mono text-[rgba(255,255,255,0.65)] truncate">{rootHash}</span>
            <button
              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(rootHash); }}
              className="text-[rgba(255,255,255,0.2)] hover:text-[#00F5D4] transition-colors flex-shrink-0"
              title="Copy root hash"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* TX Hash */}
        {txHash && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-[rgba(255,255,255,0.35)] uppercase tracking-widest font-semibold">Settlement TX</span>
            <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-2 hover:border-[rgba(139,92,246,0.2)] transition-colors">
              <a
                href={`https://chainscan-galileo.0g.ai/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[rgba(139,92,246,0.85)] truncate hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-50" />
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); txHash && navigator.clipboard.writeText(txHash); }}
                className="text-[rgba(255,255,255,0.2)] hover:text-[#8B5CF6] transition-colors flex-shrink-0"
                title="Copy TX hash"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ambient glow on hover */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[rgba(0,245,212,0.04)] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

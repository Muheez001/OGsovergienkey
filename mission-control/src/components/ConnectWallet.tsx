"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { motion } from "framer-motion";
import { Wallet, LogOut, AlertTriangle, ChevronDown } from "lucide-react";
import { ogGalileoTestnet } from "@/config/chain";

/**
 * Wallet connection button for Mission Control.
 * Handles connect/disconnect and chain switching to 0G Galileo.
 */
export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongChain = isConnected && chainId !== ogGalileoTestnet.id;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* Wrong chain warning */}
        {isWrongChain && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => switchChain({ chainId: ogGalileoTestnet.id })}
            className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all"
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "#F59E0B",
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            Switch to 0G
          </motion.button>
        )}

        {/* Connected state */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => disconnect()}
          title="Click to disconnect"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer group transition-all duration-300"
          style={{
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
          }}
          whileHover={{
            background: "rgba(244, 63, 94, 0.08)",
            borderColor: "rgba(244, 63, 94, 0.2)",
          }}
        >
          {/* Status dot */}
          <div
            className="w-2 h-2 rounded-full group-hover:opacity-0 transition-all absolute"
            style={{ background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }}
          />
          <div className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all absolute"
            style={{ background: "#F43F5E", boxShadow: "0 0 6px rgba(244,63,94,0.6)" }} />
          <div className="w-2 h-2 flex-shrink-0" /> {/* spacer */}

          {/* Address */}
          <span className="text-sm font-mono text-[rgba(255,255,255,0.75)] group-hover:text-[rgba(255,255,255,0.5)] transition-colors">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>

          {/* Icon */}
          <LogOut
            className="w-3.5 h-3.5 text-[rgba(255,255,255,0.2)] group-hover:text-[#F43F5E] transition-colors"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={isPending}
      onClick={() => {
        const connector = connectors[0];
        if (connector) connect({ connector });
      }}
      className="px-5 py-2.5 rounded-full flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(0,245,212,0.12), rgba(139,92,246,0.12))",
        border: "1px solid rgba(0, 245, 212, 0.25)",
        color: "#00F5D4",
      }}
    >
      {/* Animated shimmer */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 25%, rgba(0,245,212,0.06) 50%, transparent 75%)",
        }}
      />
      <Wallet className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{isPending ? "Connecting..." : "Connect Wallet"}</span>
    </motion.button>
  );
}

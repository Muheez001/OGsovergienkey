import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { Web3Provider } from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "Sovereign Agent Keys | Mission Control",
  description: "Non-Custodial AI Agent Infrastructure on the 0G Network — powered by ZK-proofs and MPC key sharding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          background: "#0A0A0F",
          color: "rgba(255,255,255,0.9)",
          fontFamily: "'Inter', -apple-system, sans-serif",
          minHeight: "100vh",
        }}
      >
        <Web3Provider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                background: "rgba(16, 16, 26, 0.97)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}

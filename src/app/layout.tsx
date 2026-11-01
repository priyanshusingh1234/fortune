import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import FortuneNav from "@/components/FortuneNav";

export const metadata: Metadata = {
  title: "Fortune 🥠 • Hack Club YSWS",
  description: "Code software, get seed funded, build a real business. A Hack Club You Ship, We Ship for teen founders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Patrick+Hand&family=Space+Grotesk:wght@500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://assets.hackclub.com/icon-rounded.png" />
      </head>
      <body className="min-h-screen bg-[#f7f1e1] text-[#181926] antialiased selection:bg-[#ec3750] selection:text-white">
        <AuthProvider>
          {/* Hack Club Flag Ribbon */}
          <a
            href="https://hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hackclub-flag"
            title="Part of Hack Club"
          >
            <img
              src="https://assets.hackclub.com/flag-orpheus-top.svg"
              alt="Hack Club Flag"
              className="w-full h-auto drop-shadow-md hover:translate-y-1 transition-transform"
            />
          </a>

          {/* Persistent Retro Top Navbar */}
          <FortuneNav />

          <div className="pt-12">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rami Al-Hakimi | Portfolio",
  description: "Computer Science Student @ VU Amsterdam | Software Engineer | Cybersecurity Enthusiast | Vibe Coder",
  authors: [{ name: "Rami Al-Hakimi" }],
  openGraph: {
    title: "Rami Al-Hakimi | Portfolio",
    description: "Computer Science Student @ VU Amsterdam | Software Engineer | Cybersecurity Enthusiast | Vibe Coder",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Press Start 2P', monospace; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 12px; }
          ::-webkit-scrollbar-track { background: #555; }
          ::-webkit-scrollbar-thumb { background: #8B8B8B; border: 2px solid #373737; }
          @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 0.6; } 100% { transform: translateY(-200px); opacity: 0; } }
          @keyframes orbFloat { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: 0.8; } 50% { transform: translateY(-120px) scale(1.3); opacity: 0.6; } 100% { transform: translateY(-250px) scale(0.5); opacity: 0; } }
          @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

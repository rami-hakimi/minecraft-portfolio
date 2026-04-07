"use client";

import React, { useState, useEffect } from "react";

interface BlockColors {
  top: string;
  side: string;
  dark: string;
}

const BLOCKS: Record<string, BlockColors> = {
  grass: { top: "#5D9B47", side: "#8B6B3D", dark: "#4A7C38" },
  dirt: { top: "#8B6B3D", side: "#7A5C30", dark: "#654D28" },
  stone: { top: "#7F7F7F", side: "#6B6B6B", dark: "#5A5A5A" },
  diamond: { top: "#4AEDD9", side: "#2CB5A8", dark: "#1E8A7F" },
  gold: { top: "#FCDB05", side: "#DDA520", dark: "#B8860B" },
  wood: { top: "#BC9862", side: "#A0804E", dark: "#856A3E" },
  iron: { top: "#D8D8D8", side: "#BCBCBC", dark: "#A0A0A0" },
  redstone: { top: "#FF3333", side: "#CC2222", dark: "#991111" },
  lapis: { top: "#3355CC", side: "#2244AA", dark: "#113388" },
};

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="16" viewBox="0 0 9 8" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="0" width="2" height="1" fill={filled ? "#ff0000" : "#555"} />
      <rect x="5" y="0" width="2" height="1" fill={filled ? "#ff0000" : "#555"} />
      <rect x="0" y="1" width="4" height="1" fill={filled ? "#ff0000" : "#555"} />
      <rect x="4" y="1" width="4" height="1" fill={filled ? "#dd0000" : "#444"} />
      <rect x="0" y="2" width="4" height="1" fill={filled ? "#ff0000" : "#555"} />
      <rect x="4" y="2" width="5" height="1" fill={filled ? "#dd0000" : "#444"} />
      <rect x="0" y="3" width="5" height="1" fill={filled ? "#ff0000" : "#555"} />
      <rect x="5" y="3" width="4" height="1" fill={filled ? "#dd0000" : "#444"} />
      <rect x="1" y="4" width="7" height="1" fill={filled ? "#cc0000" : "#444"} />
      <rect x="2" y="5" width="5" height="1" fill={filled ? "#bb0000" : "#333"} />
      <rect x="3" y="6" width="3" height="1" fill={filled ? "#aa0000" : "#333"} />
      <rect x="4" y="7" width="1" height="1" fill={filled ? "#990000" : "#222"} />
    </svg>
  );
}

function Block3D({ type, size = 60 }: { type: string; size?: number }) {
  const b = BLOCKS[type] || BLOCKS.grass;
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", transform: "rotateX(-25deg) rotateY(35deg)" }}>
      <div style={{ position: "absolute", width: size, height: size, background: b.top, transform: `translateY(-${size / 2}px) rotateX(90deg)`, border: "2px solid rgba(0,0,0,0.2)", boxShadow: "inset 0 0 10px rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", width: size, height: size, background: b.side, border: "2px solid rgba(0,0,0,0.2)", boxShadow: "inset 0 0 8px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", width: size, height: size, background: b.dark, transform: `translateX(${size / 2}px) rotateY(90deg)`, border: "2px solid rgba(0,0,0,0.2)", boxShadow: "inset 0 0 12px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

function Particle({ delay }: { delay: number }) {
  return <div style={{ position: "absolute", width: 4, height: 4, background: "#5D9B47", left: `${Math.random() * 100}%`, bottom: 0, opacity: 0, animation: `floatUp 4s ${delay}s infinite`, imageRendering: "pixelated" }} />;
}

function ExpOrb({ x, delay }: { x: number; delay: number }) {
  return <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "radial-gradient(circle, #7FFF00, #32CD32)", left: `${x}%`, bottom: 20, opacity: 0, boxShadow: "0 0 6px #7FFF00, 0 0 12px #32CD32", animation: `orbFloat 5s ${delay}s infinite` }} />;
}

function ToolbarSlot({ active, children, onClick, label }: { active: boolean; children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <div onClick={onClick} title={label} style={{ width: 48, height: 48, background: active ? "#555" : "#8B8B8B", border: active ? "3px solid #fff" : "3px solid #373737", borderTopColor: active ? "#fff" : "#C6C6C6", borderLeftColor: active ? "#fff" : "#C6C6C6", borderBottomColor: active ? "#fff" : "#373737", borderRightColor: active ? "#fff" : "#373737", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", imageRendering: "pixelated" }}>
      {children}
    </div>
  );
}

function McPanel({ children, title, style = {} }: { children: React.ReactNode; title?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#C6C6C6", border: "4px solid #000", borderTopColor: "#FFF", borderLeftColor: "#FFF", borderBottomColor: "#555", borderRightColor: "#555", padding: 16, ...style }}>
      {title && <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: "#404040", marginBottom: 12, textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}>{title}</div>}
      {children}
    </div>
  );
}

function BlockIcon({ type, size = 28 }: { type: string; size?: number }) {
  const b = BLOCKS[type];
  return (
    <div style={{ width: size, height: size, position: "relative", imageRendering: "pixelated" }}>
      <div style={{ position: "absolute", inset: 0, background: b.side, borderRight: `${size / 4}px solid ${b.dark}`, borderBottom: `${size / 4}px solid ${b.dark}`, borderTop: `${size / 4}px solid ${b.top}`, borderLeft: `${size / 4}px solid ${b.top}` }} />
    </div>
  );
}

// Minecraft Steve-style pixel art avatar
function SteveAvatar() {
  return (
    <div style={{ width: 100, height: 140, imageRendering: "pixelated", flexShrink: 0, position: "relative", overflow: "hidden", background: "#4a7a8a", border: "3px solid #3a6a7a" }}>
      {/* Hair */}
      <div style={{ position: "absolute", top: 4, left: 22, width: 56, height: 12, background: "#3b2011" }} />
      <div style={{ position: "absolute", top: 10, left: 18, width: 64, height: 6, background: "#3b2011" }} />
      {/* Head */}
      <div style={{ position: "absolute", top: 16, left: 24, width: 52, height: 40, background: "#c8946e" }}>
        {/* Hair sides */}
        <div style={{ position: "absolute", top: -6, left: 0, width: 52, height: 12, background: "#3b2011" }} />
        <div style={{ position: "absolute", top: 6, left: 0, width: 8, height: 20, background: "#3b2011" }} />
        <div style={{ position: "absolute", top: 6, right: 0, width: 8, height: 20, background: "#3b2011" }} />
        {/* Eyes */}
        <div style={{ position: "absolute", top: 14, left: 10, width: 10, height: 6, background: "#fff" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 6, height: 6, background: "#3b2596" }} />
        </div>
        <div style={{ position: "absolute", top: 14, right: 10, width: 10, height: 6, background: "#fff" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 6, background: "#3b2596" }} />
        </div>
        {/* Nose */}
        <div style={{ position: "absolute", top: 22, left: 22, width: 8, height: 4, background: "#b07a55" }} />
        {/* Mouth */}
        <div style={{ position: "absolute", bottom: 6, left: 16, width: 20, height: 3, background: "#6b4535" }} />
      </div>
      {/* Body - teal shirt */}
      <div style={{ position: "absolute", top: 58, left: 18, width: 64, height: 44, background: "#3bbcb8" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50)", width: 20, height: 4, background: "#329d9a" }} />
      </div>
      {/* Arms */}
      <div style={{ position: "absolute", top: 58, left: 4, width: 16, height: 40, background: "#c8946e", border: "2px solid #a07850" }} />
      <div style={{ position: "absolute", top: 58, right: 4, width: 16, height: 40, background: "#c8946e", border: "2px solid #a07850" }} />
      {/* Legs */}
      <div style={{ position: "absolute", bottom: 0, left: 26, width: 24, height: 30, background: "#3b3b8a", borderRight: "2px solid #2b2b6a" }} />
      <div style={{ position: "absolute", bottom: 0, right: 26, width: 24, height: 30, background: "#3b3b8a", borderLeft: "2px solid #2b2b6a" }} />
      {/* Shoes */}
      <div style={{ position: "absolute", bottom: 0, left: 24, width: 26, height: 8, background: "#555" }} />
      <div style={{ position: "absolute", bottom: 0, right: 24, width: 26, height: 8, background: "#555" }} />
    </div>
  );
}

const SECTIONS = ["home", "about", "skills", "xp", "quests", "contact"];
const NAV_BLOCKS = ["grass", "diamond", "gold", "iron", "redstone", "lapis"];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [dayNight, setDayNight] = useState<number>(0);
  const [sent, setSent] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formMsg, setFormMsg] = useState<string>("");

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setLoaded(true), 400); }
      setLoadProgress(p);
    }, 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setDayNight((d) => (d === 0 ? 1 : 0)), 30000);
    return () => clearInterval(iv);
  }, []);

  const isDark = dayNight === 1;
  const skyGrad = isDark
    ? "linear-gradient(180deg, #0a0a2a 0%, #1a1a4a 40%, #2a1a3a 100%)"
    : "linear-gradient(180deg, #87CEEB 0%, #68B8E0 50%, #90D5F0 100%)";

  const handleSend = async () => {
    setSending(true);
    const data = new FormData();
    data.append("name", formName);
    data.append("email", formEmail);
    data.append("message", formMsg);
    try {
      await fetch("https://formspree.io/f/xkopyoyv", { method: "POST", body: data, headers: { Accept: "application/json" } });
      setSent(true);
      setFormName(""); setFormEmail(""); setFormMsg("");
    } catch (err) { console.error(err); }
    setSending(false);
  };

  if (!loaded) {
    return (
      <div style={{ height: "100vh", background: "#E22837", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Press Start 2P', monospace", color: "#fff", gap: 30 }}>
        <div style={{ fontSize: 16, textShadow: "2px 2px #000" }}>LOADING WORLD...</div>
        <div style={{ width: 300, height: 20, background: "#000", border: "3px solid #555" }}>
          <div style={{ height: "100%", width: `${loadProgress}%`, background: "#5D9B47", transition: "width 0.2s" }} />
        </div>
        <div style={{ fontSize: 8, color: "#ddd" }}>Building terrain... {Math.floor(loadProgress)}%</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: skyGrad, fontFamily: "'Press Start 2P', monospace", color: isDark ? "#ddd" : "#333", overflow: "hidden", transition: "background 3s ease", position: "relative" }}>
      {[...Array(8)].map((_, i) => <Particle key={i} delay={i * 0.6} />)}
      {[...Array(5)].map((_, i) => <ExpOrb key={`o${i}`} x={10 + i * 20} delay={i * 1.2} />)}
      <div onClick={() => setDayNight((d) => (d === 0 ? 1 : 0))} title="Toggle day/night" style={{ position: "fixed", top: 40, right: 60, width: 60, height: 60, borderRadius: isDark ? 0 : "50%", background: isDark ? "#E8E8E8" : "#FFE066", boxShadow: isDark ? "0 0 30px rgba(200,200,255,0.3)" : "0 0 40px rgba(255,224,102,0.5)", transition: "all 3s ease", cursor: "pointer", zIndex: 10 }} />
      {isDark && [...Array(30)].map((_, i) => <div key={`s${i}`} style={{ position: "fixed", width: 2, height: 2, background: "#fff", left: `${(i * 37 + 13) % 100}%`, top: `${(i * 23 + 7) % 40}%`, opacity: 0.5, zIndex: 1 }} />)}

      <nav style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2, background: "#000", padding: 4, border: "2px solid #222", zIndex: 100 }}>
        {SECTIONS.map((sec, i) => (<ToolbarSlot key={sec} active={activeSection === sec} onClick={() => setActiveSection(sec)} label={sec}><BlockIcon type={NAV_BLOCKS[i]} size={28} /></ToolbarSlot>))}
      </nav>

      <div style={{ position: "fixed", top: 16, left: 16, display: "flex", gap: 2, zIndex: 100 }}>
        {[...Array(10)].map((_, i) => <Heart key={i} filled={i < 9} />)}
      </div>
      <div style={{ position: "fixed", bottom: 74, left: "50%", transform: "translateX(-50%)", width: 310, height: 6, background: "#000", border: "1px solid #222", zIndex: 100 }}><div style={{ height: "100%", width: "65%", background: "#7FFF00" }} /></div>
      <div style={{ position: "fixed", bottom: 78, left: "50%", transform: "translateX(-50%)", fontSize: 6, color: "#7FFF00", textShadow: "1px 1px #000", zIndex: 100 }}>CS Student — Level 3</div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 120px", minHeight: "100vh" }}>

        {activeSection === "home" && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 9, color: isDark ? "#aaa" : "#777", marginBottom: 30, lineHeight: 2.2 }}>Welcome to my profile</p>
            <h1 style={{ fontSize: 22, color: isDark ? "#FFE066" : "#333", textShadow: isDark ? "2px 2px #000" : "2px 2px rgba(0,0,0,0.2)", marginBottom: 20, lineHeight: 1.8 }}>RAMI AL-HAKIMI</h1>
            <p style={{ fontSize: 9, color: isDark ? "#aaa" : "#666", maxWidth: 550, margin: "0 auto", lineHeight: 2.5 }}>Computer Science Student @ VU Amsterdam</p>
            <p style={{ fontSize: 7, color: isDark ? "#777" : "#888", maxWidth: 500, margin: "14px auto 0", lineHeight: 2.2 }}>Software Engineer | Cybersecurity Enthusiast | Vibe Coder</p>
            <div style={{ marginTop: 60, fontSize: 8, color: isDark ? "#888" : "#999", animation: "bob 2s ease-in-out infinite" }}>▼ Select a slot below to navigate ▼</div>
          </div>
        )}

        {activeSection === "about" && (
          <div style={{ paddingTop: 40 }}>
            <McPanel title="[ ABOUT ME ]" style={{ maxWidth: 680, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <SteveAvatar />
                <div style={{ flex: 1, minWidth: 250 }}>
                  <p style={{ fontSize: 8, lineHeight: 2.4, color: "#404040", marginBottom: 12 }}>I&apos;m a Computer Science student at Vrije Universiteit Amsterdam with a strong interest in cybersecurity, software engineering, AI, and building technology that solves real world problems.</p>
                  <p style={{ fontSize: 8, lineHeight: 2.4, color: "#404040", marginBottom: 12 }}>Alongside my technical journey, I&apos;m actively involved in community initiatives and youth policy work in the Netherlands, contributing to projects focused on inclusion, migration, and social impact.</p>
                  <p style={{ fontSize: 8, lineHeight: 2.4, color: "#404040", marginBottom: 12 }}>Always learning, building, and looking for opportunities to grow both personally and technically while creating meaningful impact.</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ background: "#5D9B47", color: "#fff", padding: "6px 10px", fontSize: 7, border: "2px solid #4A7C38" }}>📍 Amsterdam, NL</div>
                    <div style={{ background: "#4A90D9", color: "#fff", padding: "6px 10px", fontSize: 7, border: "2px solid #357" }}>🎓 VU Amsterdam</div>
                  </div>
                </div>
              </div>
            </McPanel>
            <McPanel title="[ EDUCATION ]" style={{ maxWidth: 680, margin: "20px auto 0" }}>
              <div style={{ background: "#A0A0A0", border: "3px solid #555", borderTopColor: "#C6C6C6", borderLeftColor: "#C6C6C6", padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ perspective: 200, flexShrink: 0 }}><Block3D type="lapis" size={42} /></div>
                <div>
                  <div style={{ fontSize: 9, color: "#333", marginBottom: 4 }}>B.S. in Computer Science</div>
                  <div style={{ fontSize: 7, color: "#555", marginBottom: 4 }}>Vrije Universiteit Amsterdam</div>
                  <div style={{ fontSize: 6, color: "#888" }}>Amsterdam, Netherlands — In Progress</div>
                </div>
              </div>
            </McPanel>
          </div>
        )}

        {activeSection === "skills" && (
          <div style={{ paddingTop: 40 }}>
            <McPanel title="[ SKILL INVENTORY ]" style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                {[{ name: "Python", block: "gold" }, { name: "JavaScript", block: "diamond" }, { name: "HTML/CSS", block: "grass" }, { name: "C#", block: "iron" }, { name: "C++", block: "stone" }, { name: "MATLAB", block: "wood" }, { name: "Assembly", block: "redstone" }].map((s) => (
                  <div key={s.name} style={{ background: "#A0A0A0", border: "3px solid #555", borderTopColor: "#C6C6C6", borderLeftColor: "#C6C6C6", padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <BlockIcon type={s.block} size={20} />
                    <span style={{ fontSize: 8, color: "#333" }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </McPanel>
            <McPanel title="[ TOOLS & ENCHANTMENTS ]" style={{ maxWidth: 700, margin: "20px auto 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Android Studio", "AWS", "Git", "Bootstrap", "GitHub", "WordPress", "Figma", "VS Code", "Visual Studio", "Linux", "MS Office"].map((t) => (
                  <span key={t} style={{ background: "#5A3A7A", color: "#E8D0FF", padding: "5px 10px", fontSize: 7, border: "2px solid #8A6AAA", fontFamily: "'Press Start 2P'" }}>✦ {t}</span>
                ))}
              </div>
            </McPanel>
          </div>
        )}

        {activeSection === "xp" && (
          <div style={{ paddingTop: 40 }}>
            <McPanel title="[ EXPERIENCE LOG ]" style={{ maxWidth: 720, margin: "0 auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[{ role: "Cashier", place: "Action", date: "Jan 2026 – Present", block: "grass", rarity: "ACTIVE", rc: "#5D9B47" }, { role: "IT Support Specialist", place: "Studentaanhuis", date: "Dec 2025 – Mar 2026", block: "diamond", rarity: "★ TECH", rc: "#4AEDD9" }, { role: "Software Eng. Fellow", place: "Headstartar AI (Remote, NYC)", date: "Jul – Sep 2024", block: "gold", rarity: "★★ LEGENDARY", rc: "#FCDB05" }, { role: "Shelf Stocker", place: "Albert Heijn", date: "Sep 2024 – Feb 2025", block: "stone", rarity: "COMMON", rc: "#7F7F7F" }].map((j) => (
                  <div key={j.role + j.place} style={{ background: "#A0A0A0", border: "3px solid #555", borderTopColor: "#C6C6C6", borderLeftColor: "#C6C6C6", padding: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ perspective: 200, flexShrink: 0 }}><Block3D type={j.block} size={36} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 8, color: "#333", marginBottom: 4 }}>{j.role}</div>
                      <div style={{ fontSize: 7, color: "#666", marginBottom: 4 }}>{j.place}</div>
                      <div style={{ fontSize: 6, color: "#888", marginBottom: 6 }}>{j.date}</div>
                      <span style={{ fontSize: 6, color: j.rc, background: "#333", padding: "2px 8px", border: `1px solid ${j.rc}` }}>{j.rarity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </McPanel>
            <McPanel title="[ CERTIFICATIONS ]" style={{ maxWidth: 720, margin: "20px auto 0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[{ name: "National Cyber Security Summer School", org: "Dcypher — Aug 2025", block: "redstone" }, { name: "Python Coding Bootcamp", org: "New Dutch Connections — May 2024", block: "gold" }, { name: "Business Administration Diploma", org: "Qwafel Foundation", block: "iron" }, { name: "International Computer Driving License", org: "ICDL", block: "diamond" }].map((c) => (
                  <div key={c.name} style={{ background: "#A0A0A0", border: "3px solid #555", borderTopColor: "#C6C6C6", borderLeftColor: "#C6C6C6", padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
                    <BlockIcon type={c.block} size={20} />
                    <div><div style={{ fontSize: 7, color: "#333" }}>{c.name}</div><div style={{ fontSize: 6, color: "#666" }}>{c.org}</div></div>
                  </div>
                ))}
              </div>
            </McPanel>
          </div>
        )}

        {activeSection === "quests" && (
          <div style={{ paddingTop: 40 }}>
            <McPanel title="[ SIDE QUESTS & LEADERSHIP ]" style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[{ name: "International Student Ambassador", org: "VU Amsterdam", date: "Oct 2025 – Present", desc: "Representing VU Amsterdam to prospective international students.", block: "diamond", status: "★ ACTIVE QUEST", sc: "#4AEDD9" }, { name: "Lid – Jongerenpanel", org: "de Volkskrant", date: "Aug 2025 – Present", desc: "Member of the youth panel at de Volkskrant, contributing perspectives on current affairs and youth issues.", block: "gold", status: "★ ACTIVE QUEST", sc: "#FCDB05" }, { name: "Member – National Youth Strategy", org: "NJR (Dutch National Youth Council)", date: "Nov 2024 – Dec 2025", desc: "Worked with 99 young people across the Netherlands on national policy, focusing on international politics and migration.", block: "iron", status: "★ COMPLETED", sc: "#D8D8D8" }, { name: "Volunteer – Wake Up Your Mind Project", org: "VluchtelingenWerk Nederland", date: "Sep 2023 – Feb 2024", desc: "Created a magazine sharing stories of people arriving in the Netherlands, raising awareness about migration experiences.", block: "grass", status: "★ COMPLETED", sc: "#5D9B47" }, { name: "Vice President — Supervision & Evaluation", org: "Yemeni Student Union, Karabuk, Turkey", date: "Oct 2021 – Feb 2022", desc: "Led a 750+ member organization, hosted events, managed executives, and supported underprivileged communities.", block: "redstone", status: "★★ LEGENDARY QUEST", sc: "#FF6666" }].map((q) => (
                  <div key={q.name} style={{ background: "#A0A0A0", border: "3px solid #555", borderTopColor: "#C6C6C6", borderLeftColor: "#C6C6C6", padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ perspective: 200, flexShrink: 0 }}><Block3D type={q.block} size={42} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "#333", marginBottom: 4 }}>{q.name}</div>
                      <div style={{ fontSize: 7, color: "#555", marginBottom: 4 }}>{q.org}</div>
                      <div style={{ fontSize: 6, color: "#888", marginBottom: 6 }}>{q.date}</div>
                      <p style={{ fontSize: 7, color: "#555", lineHeight: 2, marginBottom: 8 }}>{q.desc}</p>
                      <span style={{ fontSize: 6, color: q.sc, background: "#333", padding: "3px 8px", border: `1px solid ${q.sc}` }}>{q.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </McPanel>
          </div>
        )}

        {activeSection === "contact" && (
          <div style={{ paddingTop: 40 }}>
            <McPanel title="[ SEND MESSAGE ]" style={{ maxWidth: 550, margin: "0 auto" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 10, color: "#5D9B47", marginBottom: 10 }}>✔ MESSAGE SENT!</div>
                  <p style={{ fontSize: 7, color: "#404040", lineHeight: 2 }}>Thanks for reaching out!</p>
                  <button onClick={() => setSent(false)} style={{ fontFamily: "'Press Start 2P'", fontSize: 7, padding: "8px 14px", background: "#5D9B47", color: "#fff", border: "3px solid #333", cursor: "pointer", marginTop: 12 }}>Send Another</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 8, color: "#404040", lineHeight: 2.2, marginBottom: 8 }}>Want to collaborate? Drop a message!</p>
                  <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your Name" style={{ fontFamily: "'Press Start 2P'", fontSize: 8, padding: 10, background: "#000", color: "#5D9B47", border: "3px solid #555", borderTopColor: "#333", borderLeftColor: "#333", outline: "none", width: "100%" }} />
                  <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} type="email" placeholder="Your Email" style={{ fontFamily: "'Press Start 2P'", fontSize: 8, padding: 10, background: "#000", color: "#5D9B47", border: "3px solid #555", borderTopColor: "#333", borderLeftColor: "#333", outline: "none", width: "100%" }} />
                  <textarea value={formMsg} onChange={(e) => setFormMsg(e.target.value)} placeholder="Your Message" rows={5} style={{ fontFamily: "'Press Start 2P'", fontSize: 8, padding: 10, background: "#000", color: "#5D9B47", border: "3px solid #555", borderTopColor: "#333", borderLeftColor: "#333", outline: "none", resize: "vertical", width: "100%" }} />
                  <button onClick={handleSend} disabled={sending} style={{ fontFamily: "'Press Start 2P'", fontSize: 9, padding: "12px 20px", background: sending ? "#888" : "#5D9B47", color: "#fff", border: "3px solid #333", borderTopColor: "#7BC462", borderLeftColor: "#7BC462", cursor: sending ? "wait" : "pointer", textShadow: "1px 1px #000", alignSelf: "flex-start" }}>
                    {sending ? "⏳ SENDING..." : "⛏ SEND"}
                  </button>
                </div>
              )}
            </McPanel>
            <McPanel title="[ LINKS ]" style={{ maxWidth: 550, margin: "20px auto 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[{ name: "GitHub", color: "#333", icon: "⬛", href: "https://github.com/rami-hakimi" }, { name: "LinkedIn", color: "#0077B5", icon: "🔷", href: "https://www.linkedin.com/in/rami-hakimi" }, { name: "X / Twitter", color: "#000", icon: "✖", href: "https://x.com/rami_hakimi?s=21" }, { name: "Email", color: "#D44638", icon: "📧", href: "mailto:ra.alhakimi@gmail.com" }].map((l) => (
                  <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ background: l.color, color: "#fff", padding: "8px 14px", fontSize: 7, fontFamily: "'Press Start 2P'", border: "3px solid rgba(0,0,0,0.3)", borderTopColor: "rgba(255,255,255,0.2)", borderLeftColor: "rgba(255,255,255,0.2)", cursor: "pointer", textShadow: "1px 1px #000" }}>{l.icon} {l.name}</div>
                  </a>
                ))}
              </div>
            </McPanel>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 8, background: "repeating-linear-gradient(90deg, #5D9B47 0px, #5D9B47 32px, #4A7C38 32px, #4A7C38 64px)", zIndex: 50 }} />
    </div>
  );
}

import { useState } from "react";

const PERSONA_CONFIGS = {
  swing_trader: {
    id: "swing_trader",
    label: "Swing Trader",
    labelHindi: "स्विंग ट्रेडर",
    description: "Short-term momentum, breakouts, and technical setups (1–30 days)",
    icon: "⚡",
    tagline: "Ride the momentum. Capture the move.",
    gradient: "from-cyan-500/20 via-cyan-400/5 to-transparent",
    glowColor: "0 0 60px rgba(6,182,212,0.2)",
    accentBg: "rgba(6,182,212,0.1)",
    accentBorder: "rgba(6,182,212,0.4)",
    metrics: ["RSI", "MACD", "Breakouts", "Volume Surge", "EMA Cross"],
  },
  investor: {
    id: "investor",
    label: "Long-Term Investor",
    labelHindi: "दीर्घकालिक निवेशक",
    description: "Fundamentals, valuations, and compounding wealth (1+ years)",
    icon: "🏦",
    tagline: "Build wealth. Think in decades.",
    gradient: "from-amber-500/20 via-amber-400/5 to-transparent",
    glowColor: "0 0 60px rgba(245,166,35,0.2)",
    accentBg: "rgba(245,166,35,0.1)",
    accentBorder: "rgba(245,166,35,0.4)",
    metrics: ["P/E Ratio", "ROE", "FCF", "Revenue Growth", "Promoter Holding"],
  },
  options_trader: {
    id: "options_trader",
    label: "Options Trader",
    labelHindi: "ऑप्शंस ट्रेडर",
    description: "Greeks, IV, OI analysis, and strategy building",
    icon: "🎯",
    tagline: "Master the asymmetry. Trade the edge.",
    gradient: "from-purple-500/20 via-purple-400/5 to-transparent",
    glowColor: "0 0 60px rgba(139,92,246,0.2)",
    accentBg: "rgba(139,92,246,0.1)",
    accentBorder: "rgba(139,92,246,0.4)",
    metrics: ["IV Rank", "PCR", "Max Pain", "OI Change", "Greeks"],
  },
};

const STARTER_PACKS = {
  swing_trader: [
    { name: "Nifty 50 Movers", symbols: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "ITC", "SBIN", "LT", "KOTAKBANK"] },
    { name: "Momentum Watchlist", symbols: ["TATAELXSI", "POLYCAB", "DIXON", "PERSISTENT", "ABB", "BEL", "HAL", "BHEL"] },
    { name: "Bank Nifty", symbols: ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "INDUSINDBK"] },
  ],
  investor: [
    { name: "Blue Chips", symbols: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "HINDUNILVR", "BAJFINANCE", "BHARTIARTL", "ITC"] },
    { name: "Dividend Watchlist", symbols: ["COALINDIA", "POWERGRID", "ONGC", "ITC", "HINDUNILVR", "INFY", "TCS"] },
    { name: "Growth Watchlist", symbols: ["PIDILITIND", "DMART", "TITAN", "BAJFINANCE", "PERSISTENT", "DIXON"] },
  ],
  options_trader: [
    { name: "High OI (FnO)", symbols: ["NIFTY", "BANKNIFTY", "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN"] },
    { name: "Volatile Watchlist", symbols: ["TATAMOTORS", "ADANIENT", "BAJFINANCE", "DLF", "ZOMATO", "IRCTC"] },
    { name: "Index Only", symbols: ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"] },
  ],
};

const FEATURES = [
  { emoji: "📊", title: "Daily Summary Pack", desc: "Every morning — what changed, what it means, exportable." },
  { emoji: "🔔", title: "Explainable Insights", desc: "What changed, historical context, and regime notes." },
  { emoji: "💼", title: "Portfolio Analytics", desc: "Unified P&L across brokers. Connect later." },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState(null);
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [prefs, setPrefs] = useState({ language: "en", time: "08:00", notifications: true });

  const toggleSymbol = (s) => {
    setSymbols((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const addPack = (packSymbols) => {
    setSymbols((prev) => [...new Set([...prev, ...packSymbols])]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#b0b0c8", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Ambient gradients */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "rgba(34,197,94,0.04)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(139,92,246,0.04)", filter: "blur(120px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fafaff", letterSpacing: "-0.02em" }}>Bazaarsaar</span>
            <span style={{ fontSize: 13, color: "#6b6b8a" }}>बाज़ारसार</span>
          </div>
          {step > 0 && step < 3 && (
            <div style={{ display: "flex", gap: 8 }}>
              {["Lens", "Watchlist", "Prefs", "Done"].map((s, i) => (
                <div key={s} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i < step ? "#22c55e" : i === step ? "#9090aa" : "#32324a", transition: "all 0.3s" }} />
              ))}
            </div>
          )}
        </header>

        <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "0 16px 48px" }}>

          {/* STEP 0: Persona Selection */}
          {step === 0 && (
            <div style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1 style={{ fontSize: 42, fontWeight: 700, color: "#fafaff", marginBottom: 8, letterSpacing: "-0.03em" }}>Choose Your Lens</h1>
                <p style={{ fontSize: 16, color: "#6b6b8a", maxWidth: 440, margin: "0 auto" }}>
                  Your universe adapts to how you see the market.<br />
                  <span style={{ fontSize: 13, color: "#4a4a6a" }}>You can switch anytime.</span>
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {Object.entries(PERSONA_CONFIGS).map(([key, config]) => {
                  const isHovered = hoveredPersona === key;
                  const isSelected = persona === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setPersona(key); setStep(1); }}
                      onMouseEnter={() => setHoveredPersona(key)}
                      onMouseLeave={() => setHoveredPersona(null)}
                      style={{
                        position: "relative", textAlign: "left", padding: "28px 24px", borderRadius: 16,
                        background: "rgba(17,17,24,0.7)", backdropFilter: "blur(16px)",
                        border: `1px solid ${(isHovered || isSelected) ? config.accentBorder : "rgba(255,255,255,0.06)"}`,
                        boxShadow: (isHovered || isSelected) ? config.glowColor : "none",
                        cursor: "pointer", transition: "all 0.4s ease", outline: "none",
                        transform: isHovered ? "translateY(-2px)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 32 }}>{config.icon}</span>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 600, color: "#ededf5" }}>{config.label}</div>
                          <div style={{ fontSize: 12, color: "#6b6b8a" }}>{config.labelHindi}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#4a4a6a", fontStyle: "italic", marginBottom: 16 }}>&quot;{config.tagline}&quot;</p>
                      <p style={{ fontSize: 13, color: "#9090aa", marginBottom: 20, lineHeight: 1.6 }}>{config.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                        {config.metrics.map((m) => (
                          <span key={m} style={{
                            fontSize: 11, padding: "4px 10px", borderRadius: 12, fontFamily: "monospace",
                            background: (isHovered || isSelected) ? config.accentBg : "rgba(26,26,36,1)",
                            color: (isHovered || isSelected) ? "#d4d4e8" : "#6b6b8a",
                            transition: "all 0.3s",
                          }}>{m}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: (isHovered || isSelected) ? "#d4d4e8" : "#4a4a6a", transition: "all 0.3s" }}>
                        <span>Select this lens</span>
                        <span style={{ transform: (isHovered || isSelected) ? "translateX(4px)" : "none", transition: "transform 0.3s" }}>→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: "#4a4a6a", marginTop: 32 }}>
                Your choice shapes what insights, metrics, and workflows surface for you.
              </p>
            </div>
          )}

          {/* STEP 1: Watchlist */}
          {step === 1 && persona && (
            <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{PERSONA_CONFIGS[persona].icon}</span>
                <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fafaff", marginBottom: 8 }}>Build Your Watchlist</h2>
                <p style={{ color: "#6b6b8a" }}>Pick starter packs or add stocks. Your daily summaries are built from this.</p>
              </div>

              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Quick Start Packs</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {STARTER_PACKS[persona].map((pack) => (
                    <button key={pack.name} onClick={() => addPack(pack.symbols)} style={{
                      padding: 16, borderRadius: 12, background: "rgba(17,17,24,0.7)", border: "1px solid rgba(255,255,255,0.06)",
                      textAlign: "left", cursor: "pointer", transition: "all 0.2s", outline: "none",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#d4d4e8" }}>{pack.name}</span>
                        <span style={{ fontSize: 12, color: "#22c55e" }}>+{pack.symbols.length}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "monospace" }}>
                        {pack.symbols.slice(0, 3).join(", ")} +{pack.symbols.length - 3}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Watchlist</h3>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6b6b8a" }}>{symbols.length} stocks</span>
                </div>
                {symbols.length === 0 ? (
                  <div style={{ padding: 32, borderRadius: 12, background: "rgba(17,17,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ color: "#4a4a6a", fontSize: 13 }}>Add stocks from the packs above</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {symbols.map((s) => (
                      <button key={s} onClick={() => toggleSymbol(s)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8,
                        background: "rgba(26,26,36,1)", border: "1px solid rgba(255,255,255,0.06)", color: "#b0b0c8",
                        fontSize: 13, fontFamily: "monospace", cursor: "pointer", outline: "none", transition: "all 0.2s",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#b0b0c8"; }}
                      >
                        {s} <span style={{ opacity: 0.4 }}>✕</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => setStep(0)} style={{ fontSize: 13, color: "#4a4a6a", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
                <button onClick={() => symbols.length > 0 && setStep(2)} style={{
                  padding: "10px 24px", borderRadius: 12, fontSize: 13, fontWeight: 500, border: "none", cursor: symbols.length > 0 ? "pointer" : "not-allowed",
                  background: symbols.length > 0 ? "#ededf5" : "#1a1a24", color: symbols.length > 0 ? "#0a0a0f" : "#4a4a6a", transition: "all 0.2s",
                }}>Continue ({symbols.length}) →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Preferences */}
          {step === 2 && (
            <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>⚙️</span>
                <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fafaff", marginBottom: 8 }}>Your Preferences</h2>
                <p style={{ color: "#6b6b8a" }}>Customize Bazaarsaar. Change anytime later.</p>
              </div>

              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Language / भाषा</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[{ id: "en", label: "English", icon: "🇬🇧" }, { id: "hi", label: "हिंदी", icon: "🇮🇳" }, { id: "both", label: "Both / दोनों", icon: "🌐" }].map((lang) => (
                    <button key={lang.id} onClick={() => setPrefs({ ...prefs, language: lang.id })} style={{
                      padding: 16, borderRadius: 12, background: "rgba(17,17,24,0.7)", textAlign: "center",
                      border: `1px solid ${prefs.language === lang.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer", outline: "none", transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 24, display: "block", marginBottom: 4 }}>{lang.icon}</span>
                      <span style={{ fontSize: 13, color: "#b0b0c8" }}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Daily Pack Delivery</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {[{ v: "07:00", l: "7:00 AM", n: "Early bird" }, { v: "08:00", l: "8:00 AM", n: "Before market" }, { v: "09:00", l: "9:00 AM", n: "Market open" }, { v: "18:00", l: "6:00 PM", n: "EOD review" }].map((t) => (
                    <button key={t.v} onClick={() => setPrefs({ ...prefs, time: t.v })} style={{
                      padding: 16, borderRadius: 12, background: "rgba(17,17,24,0.7)", textAlign: "left",
                      border: `1px solid ${prefs.time === t.v ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer", outline: "none", transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 16, fontFamily: "monospace", color: "#d4d4e8", display: "block" }}>{t.l}</span>
                      <span style={{ fontSize: 12, color: "#4a4a6a" }}>{t.n}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => setStep(1)} style={{ fontSize: 13, color: "#4a4a6a", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ padding: "10px 24px", borderRadius: 12, fontSize: 13, fontWeight: 500, background: "#ededf5", color: "#0a0a0f", border: "none", cursor: "pointer" }}>Complete Setup →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete */}
          {step === 3 && persona && (
            <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{PERSONA_CONFIGS[persona].icon}</div>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fafaff", marginBottom: 12 }}>You&apos;re all set!</h2>
              <p style={{ color: "#6b6b8a", marginBottom: 32 }}>
                Your <span style={{ color: "#d4d4e8", fontWeight: 500 }}>{PERSONA_CONFIGS[persona].label}</span> universe is ready with <span style={{ fontFamily: "monospace", color: "#d4d4e8" }}>{symbols.length}</span> stocks.
              </p>

              <div style={{ padding: 24, borderRadius: 16, background: "rgba(17,17,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left", marginBottom: 32 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>What happens next</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {FEATURES.map((f) => (
                    <div key={f.title} style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{f.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#d4d4e8", marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 12, color: "#4a4a6a", lineHeight: 1.5 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setStep(0); setPersona(null); setSymbols([]); }} style={{
                padding: "14px 32px", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "white",
                boxShadow: "0 4px 20px rgba(34,197,94,0.25)", transition: "all 0.3s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 30px rgba(34,197,94,0.35)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.25)"}
              >
                Enter Bazaarsaar →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

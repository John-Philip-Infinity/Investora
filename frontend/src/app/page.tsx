"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TickerTape from "@/components/TickerTape";
import GPSAnalyzer from "@/components/GPSAnalyzer";
import Screeners from "@/components/Screeners";
import MarketExplorer from "@/components/MarketExplorer";
import AICoach from "@/components/AICoach";
import { Activity, BarChart2, Globe, BrainCircuit, AlertTriangle, Shield, TrendingUp } from "lucide-react";

const TABS = [
  { id: "analyzer",  label: "GPS Analyzer",   icon: Activity },
  { id: "markets",   label: "Markets",         icon: Globe },
  { id: "screeners", label: "Screeners",       icon: BarChart2 },
  { id: "coach",     label: "AI Coach",        icon: BrainCircuit },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [analysisTicker, setAnalysisTicker] = useState("");

  const triggerAnalysis = (ticker: string) => {
    setAnalysisTicker(ticker);
    setActiveTab("analyzer");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("investora_active_tab", "analyzer");
      sessionStorage.setItem("investora_ticker", ticker);
    }
  };

  // State Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem("investora_active_tab");
      const savedTicker = sessionStorage.getItem("investora_ticker");
      if (savedTab) setActiveTab(savedTab);
      if (savedTicker) setAnalysisTicker(savedTicker);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("investora_active_tab", activeTab);
    }
  }, [activeTab]);

  return (
    <div className="bg-grid" style={{ minHeight: "100vh", backgroundColor: "#0B0E11" }}>
      <Navbar onLaunch={() => setActiveTab("analyzer")} />
      <TickerTape />

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, left: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: -200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="container-responsive" style={{ position: "relative", zIndex: 1, paddingBottom: "4rem" }}>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 4, padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "0.55rem 1.1rem", borderRadius: 8, border: "none",
                  cursor: "pointer", whiteSpace: "nowrap", fontSize: "0.85rem", fontWeight: 600,
                  transition: "all 0.2s",
                  background: active ? "rgba(0,229,255,0.12)" : "transparent",
                  color: active ? "#00E5FF" : "#6B7280",
                  boxShadow: active ? "inset 0 0 0 1px rgba(0,229,255,0.25)" : "none",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Page Content */}
        <div style={{ paddingTop: "2rem" }}>
          {activeTab === "analyzer"  && <GPSAnalyzer initialTicker={analysisTicker} />}
          {activeTab === "markets"   && <MarketExplorer onAnalyze={triggerAnalysis} />}
          {activeTab === "screeners" && <Screeners onAnalyze={triggerAnalysis} />}
          {activeTab === "coach"     && (
            <div className="grid-responsive-2">
                <AICoach />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Recession Mode */}
                  <div className="card" style={{ padding: "1.25rem", borderColor: "rgba(251,191,36,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ background: "rgba(251,191,36,0.12)", padding: 6, borderRadius: 8 }}>
                        <Shield size={16} color="#FBB924" />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#F3F4F6" }}>Recession Survival Mode</span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#6B7280", marginBottom: 12 }}>Macro shift → rotation suggestions active</p>
                    {[["Consumer Staples","+8%",true],["Healthcare","+6%",true],["Utilities","+5%",true],["Financials","-10%",false],["Real Estate","-9%",false]].map(([s,w,up])=>(
                      <div key={s as string} style={{ display:"flex", justifyContent:"space-between", padding:"0.4rem 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize:"0.82rem", color:"#9CA3AF" }}>{s as string}</span>
                        <span style={{ fontSize:"0.82rem", fontWeight:700, fontFamily:"monospace", color: up ? "#00C805":"#FF3B3B" }}>{w as string}</span>
                      </div>
                    ))}
                  </div>

                  {/* Red Flag Scanner */}
                  <div className="card" style={{ padding: "1.25rem", borderColor: "rgba(255,59,59,0.2)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <div style={{ background:"rgba(255,59,59,0.12)", padding:6, borderRadius:8 }}>
                        <AlertTriangle size={16} color="#FF3B3B" />
                      </div>
                      <span style={{ fontWeight:700, fontSize:"0.875rem", color:"#F3F4F6" }}>Red Flag Scanner</span>
                    </div>
                    {[["PAYTM","Revenue Decline 3Q","High"],["YES BK","D/E Ratio > 15x","High"],["ZOMATO","Negative FCF 5yr","Medium"],["ADANI","Accounting Watch","Watch"]].map(([t,f,s])=>(
                      <div key={t as string} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.5rem 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <div>
                          <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:"0.82rem", color:"#F3F4F6" }}>{t as string}</div>
                          <div style={{ fontSize:"0.7rem", color:"#6B7280" }}>{f as string}</div>
                        </div>
                        <span className={s==="High"?"stat-chip-red":s==="Medium"?"stat-chip-gold":"stat-chip-blue"}>{s as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="disclaimer-banner" style={{ marginTop: "3rem", display:"flex", alignItems:"flex-start", gap:10 }}>
          <Shield size={14} color="#FF3B3B" style={{ flexShrink:0, marginTop:2 }} />
          <p style={{ fontSize:"0.72rem", color:"#6B7280" }}>
            <strong style={{ color:"#FF3B3B" }}>Research Tool Only: </strong>
            Investora.AI does not provide financial advice, brokerage services, or money transfers. All data is simulated/aggregated for informational and educational purposes only. Not registered with SEBI or SEC.
          </p>
        </div>
      </div>
    </div>
  );
}

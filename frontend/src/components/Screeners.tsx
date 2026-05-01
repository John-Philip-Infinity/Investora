"use client";

import { useState } from "react";
import { Filter, TrendingUp, Zap, DollarSign, BarChart2, AlertCircle } from "lucide-react";

const STRATEGIES = [
  {
    id: "canslim",
    name: "CAN SLIM",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    description: "Growth at reasonable price — focuses on earnings momentum + institutional sponsorship.",
    criteria: [
      { label: "EPS Growth (Quarterly)", value: ">25%", ok: true },
      { label: "Annual EPS Growth", value: ">25% (3yr CAGR)", ok: true },
      { label: "New Product/Market", value: "Required", ok: true },
      { label: "Institutional Ownership", value: "Increasing", ok: true },
      { label: "Market Leader", value: "Top 3 in sector", ok: false },
    ],
    stocks: ["NVDA", "LT", "TATAPOWER", "APOLLOHOSP"],
  },
  {
    id: "garp",
    name: "GARP",
    icon: <Zap className="w-5 h-5" />,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    description: "Growth at a Reasonable Price — PEG Ratio < 1.5 is the key signal.",
    criteria: [
      { label: "PEG Ratio", value: "< 1.5", ok: true },
      { label: "Revenue CAGR (5yr)", value: ">12%", ok: true },
      { label: "ROE", value: ">15%", ok: true },
      { label: "Debt/Equity", value: "< 1.0", ok: true },
      { label: "FCF Positive", value: "3+ years", ok: true },
    ],
    stocks: ["INFY", "MSFT", "RELIANCE", "HDFC"],
  },
  {
    id: "value",
    name: "Deep Value",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    description: "Graham-style undervalued picks — trading below intrinsic fair value.",
    criteria: [
      { label: "P/B Ratio", value: "< 1.5", ok: true },
      { label: "P/E vs Sector Avg", value: "Discount > 30%", ok: false },
      { label: "Current Ratio", value: "> 2.0", ok: true },
      { label: "Dividend Yield", value: "> 2%", ok: true },
      { label: "Graham Number Check", value: "Price < GN", ok: true },
    ],
    stocks: ["COALINDIA", "ITC", "T", "VZ"],
  },
];

const SCREENER_RESULTS = [
  { ticker: "NVDA",       score: 94.2, signal: "Strong Buy", risk: "Momentum", change: "+3.1%" },
  { ticker: "RELIANCE",   score: 78.5, signal: "Buy",        risk: "Growth",   change: "+1.5%" },
  { ticker: "INFY",       score: 71.0, signal: "Buy",        risk: "GARP",     change: "+0.8%" },
  { ticker: "HDFC Bank",  score: 68.3, signal: "Neutral",    risk: "Value",    change: "-0.2%" },
  { ticker: "COALINDIA",  score: 61.5, signal: "Neutral",    risk: "Value",    change: "+0.4%" },
  { ticker: "PAYTM",      score: 38.2, signal: "Caution",    risk: "Speculative", change: "-1.8%" },
];

const signalColor: Record<string, string> = {
  "Strong Buy": "stat-chip-green",
  "Buy":        "stat-chip-blue",
  "Neutral":    "stat-chip-gold",
  "Caution":    "stat-chip-red",
};

export default function Screeners({ onAnalyze }: { onAnalyze: (ticker: string) => void }) {
  const [active, setActive] = useState("canslim");

  const strategy = STRATEGIES.find((s) => s.id === active)!;

  return (
    <section id="screeners" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/20 p-2 rounded-xl">
          <Filter className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Strategy Screeners</h2>
          <p className="text-sm text-gray-500">CAN SLIM · GARP · Deep Value filters applied to real-time data</p>
        </div>
      </div>

      {/* Strategy Tabs */}
      <div className="flex gap-3 flex-wrap">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              active === s.id
                ? `${s.bg} ${s.border} ${s.color}`
                : "border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300"
            }`}
          >
            {s.icon}
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid-responsive-2">
        {/* Criteria Panel */}
        <div className="card rounded-2xl p-5">
          <h3 className="font-semibold mb-1">{strategy.name} Criteria</h3>
          <p className="text-sm text-gray-500 mb-4">{strategy.description}</p>
          <div className="space-y-3">
            {strategy.criteria.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-white">{c.value}</span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${c.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {c.ok ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Matching Stocks</p>
            <div className="flex gap-2 flex-wrap">
              {strategy.stocks.map((s) => (
                <button 
                  key={s} 
                  onClick={() => onAnalyze(s)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-sm font-mono font-semibold text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Screener Results</h3>
            <span className="text-xs text-gray-500">{SCREENER_RESULTS.length} matches</span>
          </div>
          <div className="space-y-2">
            {SCREENER_RESULTS.map((r, i) => (
              <div 
                key={i} 
                onClick={() => onAnalyze(r.ticker)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-transparent hover:border-emerald-500/30 cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <BarChart2 className="w-4 h-4 text-gray-400 group-hover:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-sm">{r.ticker}</div>
                    <div className="text-xs text-gray-500">{r.risk}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--electric-blue)]">{r.score}</div>
                    <div className={`text-xs ${r.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{r.change}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${signalColor[r.signal]}`}>
                    {r.signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

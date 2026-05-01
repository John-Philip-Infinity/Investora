"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, User, Bot, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  "Analyze my portfolio risk",
  "Best sectors in recession?",
  "Explain P/E ratio",
  "What is CAGR?",
  "How to calculate fair value?",
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "Based on current macro indicators, I recommend diversifying across defensive sectors (Healthcare, Utilities) and maintaining a 20% cash reserve. Your Sharpe ratio can be improved by reducing high-beta positions during this Fed rate cycle. Remember: this is a research simulation only.",
  "analyze my portfolio risk":
    "To analyze portfolio risk, I evaluate: **Beta coefficient** (market sensitivity), **Standard Deviation** of returns, **Correlation matrix** between assets, and **Max Drawdown**. Your current simulated risk score suggests moderate-high volatility. Consider rebalancing toward lower-correlated assets like Gold and Bonds.",
  "best sectors in recession?":
    "Historically, **defensive sectors** outperform during recessions: 1) **Consumer Staples** (P&G, HUL) — inelastic demand. 2) **Healthcare** (pharma, diagnostics). 3) **Utilities** — stable cash flows. 4) **Gold** — safe haven. Avoid: Financials, Real Estate, Discretionary Consumer during economic contractions.",
  "explain p/e ratio":
    "**P/E Ratio = Market Price / Earnings Per Share**\n\nInterpretation:\n• P/E < 15: Potentially undervalued (Value zone)\n• P/E 15–25: Fair value range\n• P/E > 25: Growth premium or overvaluation risk\n\nAlways compare within the same sector. A tech company at P/E 35 may be normal; an auto stock at P/E 35 may be expensive.",
  "what is cagr?":
    "**CAGR = (End Value / Start Value)^(1/Years) - 1**\n\nExample: ₹1,00,000 → ₹2,00,000 in 5 years = CAGR of **14.87%**\n\nInvestora uses 5-Year CAGR for Revenue and EPS in the Fundamental pillar of the GPS Score. A CAGR > 15% scores above the sector median.",
  "how to calculate fair value?":
    "**DCF Method** (simplified):\n\nFair Value = Σ (FCF_t / (1+r)^t) + Terminal Value\n\nWhere: r = Discount Rate (WACC), FCF = Free Cash Flow\n\nInvestora uses a **blended model**: 40% DCF + 30% P/E multiple reversion + 30% Graham Number. A stock trading below estimated Fair Value by >15% triggers a 'Buy Zone' signal.",
};

function getAIResponse(input: string): string {
  const key = input.toLowerCase().trim();
  for (const k of Object.keys(AI_RESPONSES)) {
    if (k !== "default" && key.includes(k)) return AI_RESPONSES[k];
  }
  return AI_RESPONSES.default;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome to the **Investora AI Wealth Coach**. I can help with Portfolio Risk Analysis, Diversification Strategy, Valuation Methods, and Market Education. How can I assist your research today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
    const aiMsg: Message = {
      role: "ai",
      content: getAIResponse(text),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setThinking(false);
  };

  // Simple markdown-like bold renderer
  const renderContent = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-[var(--electric-blue)]">
          {p}
        </strong>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <div id="coach" className="glass-card rounded-2xl flex flex-col" style={{ minHeight: "520px", maxHeight: "80vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-500/20 p-1.5 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Wealth Coach</h3>
            <p className="text-xs text-gray-500">Research & Education Only</p>
          </div>
        </div>
        <button
          onClick={() =>
            setMessages([
              {
                role: "ai",
                content: "Session reset. How can I assist your research?",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2.5 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-thin">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === "user" ? "chat-user" : "chat-ai"} px-4 py-3`}>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-200">
                {renderContent(msg.content)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1.5">{msg.time}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="chat-ai px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about markets, valuation, strategy..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-xl px-3 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          For educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}

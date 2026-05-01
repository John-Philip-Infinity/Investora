"use client";

import { useEffect, useRef } from "react";

interface RadarChartProps {
  technical: number;
  fundamental: number;
  sentiment: number;
  macro: number;
}

const LABELS = ["Technical", "Fundamental", "Sentiment", "Macro"];
const COLORS = {
  fill: "rgba(0,229,255,0.15)",
  stroke: "rgba(0,229,255,0.8)",
  label: "#9CA3AF",
  grid: "rgba(255,255,255,0.06)",
};

function polarToXY(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export default function RadarChart({ technical, fundamental, sentiment, macro }: RadarChartProps) {
  const values = [technical, fundamental, sentiment, macro].map((v) => v / 100);
  const N = 4;
  const cx = 120, cy = 120, R = 90;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const axisAngles = Array.from({ length: N }, (_, i) => (360 / N) * i);

  const dataPoints = values.map((v, i) => polarToXY(axisAngles[i], v * R, cx, cy));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" aria-label="Radar chart">
      {/* Grid levels */}
      {levels.map((level, li) => {
        const pts = axisAngles.map((a) => {
          const p = polarToXY(a, level * R, cx, cy);
          return `${p.x},${p.y}`;
        });
        return (
          <polygon
            key={li}
            points={pts.join(" ")}
            fill="none"
            stroke={COLORS.grid}
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {axisAngles.map((a, i) => {
        const outer = polarToXY(a, R, cx, cy);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      <polygon points={polygon} fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={COLORS.stroke} />
      ))}

      {/* Labels */}
      {axisAngles.map((a, i) => {
        const labelPos = polarToXY(a, R + 20, cx, cy);
        const vals = [technical, fundamental, sentiment, macro];
        return (
          <g key={i}>
            <text
              x={labelPos.x}
              y={labelPos.y - 6}
              textAnchor="middle"
              fontSize="9"
              fill={COLORS.label}
              fontFamily="Inter,sans-serif"
            >
              {LABELS[i]}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 6}
              textAnchor="middle"
              fontSize="10"
              fill="#00E5FF"
              fontWeight="600"
              fontFamily="Inter,sans-serif"
            >
              {Math.round(vals[i])}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

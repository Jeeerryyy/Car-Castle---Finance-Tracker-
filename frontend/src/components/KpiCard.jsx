import React from "react";

export function KpiCard({ label, value, sub, tone = "default", testid }) {
  const toneMap = {
    default: "text-[#20373B]",
    positive: "text-[#2A7B6B]",
    negative: "text-red-700",
    warn: "text-[#D99A1C]",
  };
  return (
    <div
      className="bg-white border border-[#C3E7F1] hover:border-[#519CAB] rounded-xl p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      data-testid={testid}
    >
      <div className="text-[11px] uppercase tracking-widest text-[#20373B]/70 font-bold">
        {label}
      </div>
      <div
        className={`mt-2 font-display text-2xl font-extrabold tracking-tight font-tabular ${toneMap[tone]}`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-[#519CAB] font-medium mt-1">{sub}</div>}
    </div>
  );
}

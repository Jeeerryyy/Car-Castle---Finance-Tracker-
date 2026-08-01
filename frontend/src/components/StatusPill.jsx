import React from "react";
import { Badge } from "@/components/ui/badge";

const map = {
  paid: "bg-[#519CAB]/15 text-[#20373B] border-[#519CAB]/40 font-semibold",
  partial: "bg-[#FFC64F]/25 text-[#7A5400] border-[#FFC64F]/60 font-semibold",
  pending: "bg-red-50 text-red-700 border-red-200 font-semibold",
  reserved: "bg-[#C3E7F1]/50 text-[#20373B] border-[#519CAB]/40 font-semibold",
  car_received: "bg-[#519CAB]/20 text-[#20373B] border-[#519CAB]/40 font-semibold",
  with_customer: "bg-[#FFC64F]/20 text-[#20373B] border-[#FFC64F]/50 font-semibold",
  returned: "bg-[#519CAB]/15 text-[#20373B] border-[#519CAB]/40 font-semibold",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  scheduled: "bg-[#C3E7F1]/50 text-[#20373B] border-[#519CAB]/40 font-semibold",
  en_route: "bg-[#FFC64F]/25 text-[#7A5400] border-[#FFC64F]/60 font-semibold",
  completed: "bg-[#519CAB]/15 text-[#20373B] border-[#519CAB]/40 font-semibold",
  none: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function StatusPill({ status, testid }) {
  const cls = map[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <Badge
      variant="outline"
      className={`${cls} rounded-full font-medium text-[11px] uppercase tracking-wider px-2 py-0.5`}
      data-testid={testid}
    >
      {String(status || "—").replace(/_/g, " ")}
    </Badge>
  );
}

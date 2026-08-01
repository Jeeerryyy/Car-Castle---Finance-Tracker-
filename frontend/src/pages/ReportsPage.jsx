import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { API } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Table2, Download } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(defaultMonth);

  const downloadFile = async (kind) => {
    const url = `${API}/reports/monthly.${kind}?month=${month}`;
    try {
      const res = await fetch(url, {
        credentials: "include",
        headers: (() => {
          const t = localStorage.getItem("ccg_token");
          return t ? { Authorization: `Bearer ${t}` } : {};
        })(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || res.statusText);
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `car-castle-goa-${month}.${kind}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`${kind.toUpperCase()} downloaded`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AppLayout title="Reports" subtitle="Generate branded monthly reports in PDF or Excel.">
      <div className="max-w-2xl">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="font-display font-semibold text-lg mb-1">Monthly report</div>
          <div className="text-sm text-slate-500 mb-6">
            Includes total bookings, margin, owner payables, agent payables, and savings summary.
          </div>

          <div className="space-y-1.5 mb-6 max-w-xs">
            <Label>Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              data-testid="report-month-input" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => downloadFile("pdf")}
              className="group text-left p-5 border border-[#C3E7F1] rounded-xl hover:border-[#519CAB] hover:bg-[#C3E7F1]/20 transition-all shadow-xs"
              data-testid="download-pdf-button"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div className="font-display font-bold text-[#20373B]">PDF report</div>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                Branded A4 report — ready for print or email.
              </div>
              <div className="flex items-center text-sm text-[#519CAB] font-bold">
                <Download className="w-4 h-4 mr-1.5" /> Download PDF
              </div>
            </button>

            <button
              onClick={() => downloadFile("xlsx")}
              className="group text-left p-5 border border-[#C3E7F1] rounded-xl hover:border-[#519CAB] hover:bg-[#C3E7F1]/20 transition-all shadow-xs"
              data-testid="download-xlsx-button"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="font-display font-bold text-[#20373B]">Excel workbook</div>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                Multi-sheet .xlsx — summary, bookings, and payables.
              </div>
              <div className="flex items-center text-sm text-[#519CAB] font-bold">
                <Download className="w-4 h-4 mr-1.5" /> Download Excel
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

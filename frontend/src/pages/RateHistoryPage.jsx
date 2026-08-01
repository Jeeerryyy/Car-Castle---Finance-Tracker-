import React, { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { api, formatInr, formatDate } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function RateHistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/rate-history");
      setRows(data); setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Rate History">
        <div className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Rate History" subtitle="Every rate change with effective date. Historical bookings are never recalculated.">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left px-5 py-2.5 font-semibold">Effective</th>
              <th className="text-left px-5 py-2.5 font-semibold">Entity</th>
              <th className="text-left px-5 py-2.5 font-semibold">Type</th>
              <th className="text-right px-5 py-2.5 font-semibold">Old rate</th>
              <th className="text-right px-5 py-2.5 font-semibold">New rate</th>
              <th className="text-right px-5 py-2.5 font-semibold">Δ</th>
              <th className="text-left px-5 py-2.5 font-semibold">Changed by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => {
              const delta = Number(r.new_rate) - Number(r.old_rate);
              return (
                <tr key={r.id} className="dense-row">
                  <td className="px-5 py-2.5">{formatDate(r.effective_date)}</td>
                  <td className="px-5 py-2.5 font-medium text-slate-900">{r.entity_name}</td>
                  <td className="px-5 py-2.5 text-slate-600 capitalize">{r.entity_type}</td>
                  <td className="px-5 py-2.5 text-right font-tabular text-slate-500">{formatInr(r.old_rate)}</td>
                  <td className="px-5 py-2.5 text-right font-tabular font-semibold">{formatInr(r.new_rate)}</td>
                  <td className={`px-5 py-2.5 text-right font-tabular font-semibold ${delta > 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {delta > 0 ? "+" : ""}{formatInr(delta)}
                  </td>
                  <td className="px-5 py-2.5 text-xs text-slate-500 font-mono">{r.changed_by}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No rate changes recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

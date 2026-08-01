import React, { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { api, formatDate } from "@/lib/api";
import { Loader2, User, Edit, Trash2, PlusCircle, LogIn, LogOut, Wallet, Bell, Cog, ArrowRightLeft } from "lucide-react";

const iconFor = (a) => {
  if (a === "create") return <PlusCircle className="w-4 h-4 text-emerald-600" />;
  if (a === "update") return <Edit className="w-4 h-4 text-sky-600" />;
  if (a === "delete") return <Trash2 className="w-4 h-4 text-red-600" />;
  if (a === "login") return <LogIn className="w-4 h-4 text-slate-500" />;
  if (a === "logout") return <LogOut className="w-4 h-4 text-slate-500" />;
  if (a === "payment") return <Wallet className="w-4 h-4 text-emerald-600" />;
  if (a === "reminder") return <Bell className="w-4 h-4 text-amber-600" />;
  if (a === "transfer_status") return <ArrowRightLeft className="w-4 h-4 text-violet-600" />;
  return <Cog className="w-4 h-4 text-slate-500" />;
};

export default function ActivityPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/activity", { params: { limit: 300 } });
      setRows(data); setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Activity Log">
        <div className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Activity Log" subtitle="Every admin action, timestamped with before/after diffs.">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-w-4xl">
        <ul className="divide-y divide-slate-100" data-testid="activity-list">
          {rows.map((r) => (
            <li key={r.id} className="px-5 py-3 flex items-start gap-3 dense-row" data-testid={`activity-row-${r.id}`}>
              <div className="mt-1">{iconFor(r.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-medium text-slate-900">{r.admin_email}</span>
                  <span className="text-slate-500"> {r.action.replace("_", " ")} </span>
                  <span className="text-slate-700 font-medium">{r.target_collection}</span>
                  {r.target_id && <span className="text-xs text-slate-400 font-mono ml-1">#{r.target_id.slice(0, 8)}</span>}
                </div>
                {r.diff && Object.keys(r.diff).length > 0 && (
                  <details className="mt-1 text-xs text-slate-500">
                    <summary className="cursor-pointer">Details</summary>
                    <pre className="bg-slate-50 border border-slate-200 mt-1 p-2 rounded text-[11px] overflow-x-auto">
                      {JSON.stringify(r.diff, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <div className="text-xs text-slate-500 whitespace-nowrap">
                {new Date(r.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-5 py-12 text-center text-slate-500">No activity yet.</li>
          )}
        </ul>
      </div>
    </AppLayout>
  );
}

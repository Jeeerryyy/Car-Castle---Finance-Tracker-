import React, { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [form, setForm] = useState({
    savings_percent: 10,
    reminder_template_owner: "",
    reminder_template_agent: "",
    reminder_template_transfer: "",
    reminder_interval_days: 3,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/settings");
      setForm({ ...form, ...data });
    })(); // eslint-disable-next-line
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/settings", {
        ...form,
        savings_percent: Number(form.savings_percent),
        reminder_interval_days: Number(form.reminder_interval_days),
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally { setSaving(false); }
  };

  return (
    <AppLayout title="Settings" subtitle="Savings percentage, reminder templates and cadence.">
      <div className="max-w-2xl bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <div className="font-display font-semibold text-slate-900 mb-3">Savings</div>
          <div className="space-y-1.5 max-w-xs">
            <Label>Savings percentage of net profit</Label>
            <div className="flex items-center gap-2">
              <Input type="number" step="0.5" value={form.savings_percent}
                onChange={(e) => setForm({ ...form, savings_percent: e.target.value })}
                data-testid="settings-savings-input" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="font-display font-semibold text-slate-900 mb-3">Reminder engine (MOCK)</div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Interval between reminders (days)</Label>
              <Input type="number" className="max-w-xs" value={form.reminder_interval_days}
                onChange={(e) => setForm({ ...form, reminder_interval_days: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Owner reminder template</Label>
              <Textarea rows={2} value={form.reminder_template_owner}
                onChange={(e) => setForm({ ...form, reminder_template_owner: e.target.value })}
                data-testid="settings-owner-tpl" />
              <div className="text-[11px] text-slate-500">Placeholders: {"{name}"}, {"{amount}"}</div>
            </div>
            <div className="space-y-1.5">
              <Label>Agent reminder template</Label>
              <Textarea rows={2} value={form.reminder_template_agent}
                onChange={(e) => setForm({ ...form, reminder_template_agent: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Transfer status template</Label>
              <Textarea rows={2} value={form.reminder_template_transfer}
                onChange={(e) => setForm({ ...form, reminder_template_transfer: e.target.value })} />
              <div className="text-[11px] text-slate-500">Placeholders: {"{booking_id}"}, {"{status}"}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-[#20373B] hover:bg-[#2C494E] text-[#FFC64F] font-bold" data-testid="settings-save-button">
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

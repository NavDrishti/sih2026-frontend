import React, { useState } from 'react';
import {
  FileText,
  AlertOctagon,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Download,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { REPORT_TEMPLATES, RECENT_GENERATED_REPORTS } from '../../data/sentinelData';

export const ReportsPageView: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    FileText,
    AlertOctagon,
    AlertTriangle,
    MapPin,
    ShieldCheck,
    TrendingUp
  };

  const handleDownload = (title: string) => {
    setDownloadSuccess(`Exported "${title}" (PDF / JSON)`);
    setTimeout(() => setDownloadSuccess(null), 3500);

    // Trigger instant mock download of report
    const blob = new Blob(
      [
        `NAV DRISHTI / SENTINEL HSE - SAFETY INTELLIGENCE REPORT\nTitle: ${title}\nGenerated: ${new Date().toISOString()}\nPlatform: SIH 2026 Process Safety Intel\nStatus: Verified\n`
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_2026.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{downloadSuccess}</span>
          </div>
          <span className="text-[10px] text-emerald-600">Saved to Downloads</span>
        </div>
      )}

      {/* Report Templates Section matching Screenshot 283 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Report Templates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map((tmpl) => {
            const Icon = iconMap[tmpl.icon] || FileText;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleDownload(tmpl.title)}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131f37] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${tmpl.color}15`, color: tmpl.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tmpl.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{tmpl.badge}</span>
                  <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium flex items-center gap-1">
                    Download <Download className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Generated Reports Table matching Screenshot 283 */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Generated Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last 5 reports
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="py-3 px-4">REPORT</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">PERIOD</th>
                <th className="py-3 px-4">GENERATED</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {RECENT_GENERATED_REPORTS.map((rpt) => (
                <tr
                  key={rpt.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {rpt.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {rpt.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {rpt.period}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {rpt.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownload(rpt.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

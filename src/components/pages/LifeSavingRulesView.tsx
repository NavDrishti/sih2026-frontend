import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Box,
  Flame,
  TrendingUp,
  Slash,
  BoxSelect,
  Crosshair,
  FileCheck,
  Car,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { IOGP_LIFE_SAVING_RULES_9, SentinelObservation } from '../../data/sentinelData';
import { IOGPRule } from '../../types/safety';

interface LifeSavingRulesViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
  onFilterObservationsByRule?: (rule: IOGPRule) => void;
}

export const LifeSavingRulesView: React.FC<LifeSavingRulesViewProps> = ({
  observations,
  onSelectObservation,
  onFilterObservationsByRule
}) => {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  // Map icon strings to Lucide components
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Zap,
    Box,
    Flame,
    TrendingUp,
    Slash,
    BoxSelect,
    Crosshair,
    FileCheck,
    Car
  };

  const chartData = IOGP_LIFE_SAVING_RULES_9.map((rule) => ({
    name: rule.name,
    exposures: rule.exposures,
    sif: rule.sifPotentialCount
  }));

  const activeRuleData = selectedRule
    ? IOGP_LIFE_SAVING_RULES_9.find(r => r.id === selectedRule)
    : null;

  const relatedObservations = selectedRule
    ? observations.filter(o => o.iogp_rule === activeRuleData?.name)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Bar Chart: Exposure Tracking Across 9 Rules */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              IOGP Life-Saving Rules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              9 rules • exposure tracking across all sites
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={10}
                interval={0}
                angle={-25}
                textAnchor="end"
                tickLine={false}
              />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="exposures" name="Total Exposures" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sif" name="SIF Potential" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 9 Interactive Rule Cards Grid matching Screenshot 277 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ALL 9 LIFE-SAVING RULES
          </span>
          {selectedRule && (
            <button
              onClick={() => setSelectedRule(null)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Reset selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IOGP_LIFE_SAVING_RULES_9.map((rule) => {
            const Icon = iconMap[rule.icon] || ShieldCheck;
            const isSelected = selectedRule === rule.id;

            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(isSelected ? null : rule.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#131f37] hover:shadow-md flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Card Top: Icon & Chevron */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${rule.color}18`, color: rule.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                </div>

                {/* Card Body */}
                <div className="space-y-1 mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rule.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {rule.description}
                  </p>
                </div>

                {/* Card Bottom Metrics */}
                <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {rule.exposures}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Exposures
                    </span>
                  </div>

                  <div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {rule.sifPotentialCount}
                    </span>
                    <span className="text-[11px] text-red-500/80 block font-medium">
                      SIF Potential
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Rule Linked Observations Drawer / Section */}
      {selectedRule && activeRuleData && (
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Observations for: {activeRuleData.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Found {relatedObservations.length} linked reports in dataset
              </p>
            </div>
            {onFilterObservationsByRule && (
              <button
                onClick={() => onFilterObservationsByRule(activeRuleData.name)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                View in Explorer →
              </button>
            )}
          </div>

          <div className="space-y-2">
            {relatedObservations.map((obs) => (
              <div
                key={obs.report_id}
                onClick={() => onSelectObservation(obs)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {obs.report_id}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{obs.site}</span>
                    <span>•</span>
                    <span className="text-slate-500 dark:text-slate-400">{obs.activity}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                    {obs.ai_summary || obs.raw_narrative}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

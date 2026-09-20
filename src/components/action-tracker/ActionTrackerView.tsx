import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronRight, 
  AlertTriangle, 
  Check, 
  Calendar, 
  User, 
  Wrench,
  Edit3
} from 'lucide-react';
import { CorrectiveAction, SafetyReport, RefineryUnit } from '../../types/safety';
import { MOCK_CORRECTIVE_ACTIONS } from '../../data/mockRefineryData';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface ActionTrackerViewProps {
  onSelectReportById: (reportId: string) => void;
}

export const ActionTrackerView: React.FC<ActionTrackerViewProps> = ({
  onSelectReportById
}) => {
  const [actions, setActions] = useState<CorrectiveAction[]>(MOCK_CORRECTIVE_ACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);

  const statuses = ['ALL', 'OPEN', 'IN PROGRESS', 'AWAITING VERIFICATION', 'CLOSED', 'OVERDUE'];
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];

  const filteredActions = actions.filter((act) => {
    if (statusFilter !== 'ALL' && act.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && act.priority !== priorityFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        act.action_id.toLowerCase().includes(q) ||
        act.report_id.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.owner.toLowerCase().includes(q) ||
        act.unit.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (actionId: string, newStatus: CorrectiveAction['status']) => {
    setActions(prev => prev.map(a => a.action_id === actionId ? { ...a, status: newStatus } : a));
    if (selectedAction?.action_id === actionId) {
      setSelectedAction(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Header & Controls */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-hazard-cyan" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              SIF CORRECTIVE ACTIONS & BARRIER RESTORATION TRACKER
            </h2>
          </div>
          <p className="text-xs text-industrial-400 font-sans mt-0.5">
            Verification workflow for engineered barrier reinstatements and HSSE preventative actions
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-industrial-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action ID, owner, unit..."
            className="w-full bg-industrial-950 border border-industrial-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-industrial-500 font-mono focus:outline-hidden"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-industrial-900/60 border border-industrial-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-industrial-500 uppercase mr-1">STATUS:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase transition border ${
                statusFilter === st
                  ? 'bg-hazard-cyan-dark text-cyan-200 border-hazard-cyan-border font-bold'
                  : 'bg-industrial-950 text-industrial-400 border-industrial-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-industrial-500 uppercase mr-1">PRIORITY:</span>
          {priorities.map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-2 py-0.5 text-[10px] font-mono transition border ${
                priorityFilter === pr
                  ? 'bg-hazard-red text-white border-red-500 font-bold'
                  : 'bg-industrial-950 text-industrial-400 border-industrial-800 hover:text-white'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Action Table */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-industrial-800 bg-industrial-950 text-industrial-400 text-[10px] uppercase tracking-wider">
                <th className="p-2.5">ACTION ID</th>
                <th className="p-2.5">RELATED SIF REPORT</th>
                <th className="p-2.5">ACTION DESCRIPTION</th>
                <th className="p-2.5">PRIORITY</th>
                <th className="p-2.5">UNIT</th>
                <th className="p-2.5">OWNER</th>
                <th className="p-2.5">DUE DATE</th>
                <th className="p-2.5">STATUS</th>
                <th className="p-2.5 text-right">MANAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850 text-xs">
              {filteredActions.map((act) => {
                const isCritical = act.priority === 'CRITICAL';
                const isOverdue = act.status === 'OVERDUE';
                const isOpen = act.status === 'OPEN';

                return (
                  <tr
                    key={act.action_id}
                    onClick={() => setSelectedAction(act)}
                    className="hover:bg-industrial-850/70 transition cursor-pointer"
                  >
                    <td className="p-2.5 font-bold text-white whitespace-nowrap">
                      {act.action_id}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReportById(act.report_id);
                        }}
                        className="text-hazard-cyan hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{act.report_id}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </td>
                    <td className="p-2.5 font-sans text-industrial-200 max-w-xs leading-snug">
                      {act.description}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <IndustrialBadge 
                        variant={isCritical ? 'critical' : act.priority === 'HIGH' ? 'amber' : 'neutral'} 
                        size="xs"
                      >
                        {act.priority}
                      </IndustrialBadge>
                    </td>
                    <td className="p-2.5 whitespace-nowrap font-bold text-hazard-cyan">
                      {act.unit}
                    </td>
                    <td className="p-2.5 font-sans text-industrial-300 text-[11px] whitespace-nowrap">
                      {act.owner}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-industrial-400 whitespace-nowrap">
                      {act.due_date}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isOverdue
                          ? 'bg-hazard-red text-white animate-pulse'
                          : isOpen
                          ? 'bg-hazard-red-dark text-red-200 border border-hazard-red'
                          : act.status === 'IN PROGRESS'
                          ? 'bg-hazard-amber text-black'
                          : act.status === 'AWAITING VERIFICATION'
                          ? 'bg-hazard-cyan-dark text-cyan-200 border border-hazard-cyan-border'
                          : 'bg-hazard-green-dark text-emerald-300 border border-hazard-green-border'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {act.status !== 'CLOSED' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(
                                act.action_id,
                                act.status === 'OPEN' 
                                  ? 'IN PROGRESS' 
                                  : act.status === 'IN PROGRESS' 
                                  ? 'AWAITING VERIFICATION' 
                                  : 'CLOSED'
                              );
                            }}
                            className="px-2 py-0.5 bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border border-industrial-700 text-[10px] font-mono transition"
                            title="Advance action status"
                          >
                            ADVANCE &rarr;
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-[10px] font-bold">VERIFIED ✓</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Detail & Verification Modal Drawer */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-industrial-950 border border-industrial-700 max-w-xl w-full p-5 font-mono space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-industrial-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-hazard-cyan" />
                <span className="font-bold text-white text-sm">{selectedAction.action_id}</span>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-industrial-400 hover:text-white text-xs px-2 py-1 bg-industrial-900 border border-industrial-800"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-industrial-400 uppercase">ACTION MANDATE:</div>
              <p className="text-xs text-white font-sans p-3 bg-industrial-900 border border-industrial-800 leading-relaxed">
                {selectedAction.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-industrial-900 border border-industrial-800">
                <div className="text-[10px] text-industrial-500">RELATED REPORT:</div>
                <button
                  onClick={() => onSelectReportById(selectedAction.report_id)}
                  className="text-hazard-cyan font-bold hover:underline flex items-center gap-1 mt-1"
                >
                  <span>{selectedAction.report_id}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 bg-industrial-900 border border-industrial-800">
                <div className="text-[10px] text-industrial-500">ASSIGNED OWNER:</div>
                <div className="font-semibold text-white mt-1">{selectedAction.owner}</div>
              </div>

              <div className="p-2.5 bg-industrial-900 border border-industrial-800">
                <div className="text-[10px] text-industrial-500">TARGET UNIT:</div>
                <div className="font-semibold text-hazard-cyan mt-1">{selectedAction.unit}</div>
              </div>

              <div className="p-2.5 bg-industrial-900 border border-industrial-800">
                <div className="text-[10px] text-industrial-500">DUE DATE:</div>
                <div className="font-semibold text-white mt-1">{selectedAction.due_date}</div>
              </div>
            </div>

            {selectedAction.notes && (
              <div className="p-2.5 bg-industrial-900/60 border border-industrial-800 text-[11px] text-industrial-300">
                <span className="text-industrial-500">OPERATIONAL NOTES: </span>
                <span>{selectedAction.notes}</span>
              </div>
            )}

            {/* Status Transition Control */}
            <div className="pt-3 border-t border-industrial-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-industrial-400">SET WORKFLOW STATE:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['OPEN', 'IN PROGRESS', 'AWAITING VERIFICATION', 'CLOSED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedAction.action_id, st)}
                    className={`px-2.5 py-1 text-[10px] font-mono uppercase transition border ${
                      selectedAction.status === st
                        ? 'bg-hazard-cyan text-black font-bold border-cyan-300'
                        : 'bg-industrial-900 hover:bg-industrial-800 text-industrial-300 border-industrial-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

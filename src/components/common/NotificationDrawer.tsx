import React from 'react';
import { X, AlertOctagon, AlertTriangle, Clock, Info, ExternalLink, Check } from 'lucide-react';
import { NotificationItem } from '../../types/safety';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-industrial-950 border-l border-industrial-700 shadow-2xl flex flex-col h-full z-10 font-mono">
        {/* Header */}
        <div className="p-4 border-b border-industrial-800 bg-industrial-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-hazard-red animate-critical-pulse" />
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">
              SAFETY ESCALATIONS & ALERTS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-industrial-400 hover:text-white flex items-center gap-1 px-2 py-1 bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 transition"
              title="Mark all as read"
            >
              <Check className="w-3 h-3" />
              <span>CLEAR BADGE</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-industrial-400 hover:text-white hover:bg-industrial-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.map((item) => {
            const isCritical = item.type === 'CRITICAL';
            const isHigh = item.type === 'HIGH';
            const isActionDue = item.type === 'ACTION DUE';

            return (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`p-3 border cursor-pointer transition relative group ${
                  isCritical
                    ? 'bg-hazard-red-dark/30 border-hazard-red-border hover:border-hazard-red hover:bg-hazard-red-dark/50'
                    : isHigh
                    ? 'bg-hazard-amber-dark/20 border-hazard-amber-border hover:border-hazard-amber hover:bg-hazard-amber-dark/40'
                    : isActionDue
                    ? 'bg-industrial-900 border-hazard-amber-border/70 hover:border-hazard-amber'
                    : 'bg-industrial-900 border-industrial-800 hover:border-industrial-700'
                } ${!item.read ? 'border-l-4' : ''}`}
                style={{
                  borderLeftColor: !item.read 
                    ? (isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#06b6d4') 
                    : undefined
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {isCritical && <AlertOctagon className="w-3.5 h-3.5 text-hazard-red shrink-0 animate-pulse" />}
                    {isHigh && <AlertTriangle className="w-3.5 h-3.5 text-hazard-amber shrink-0" />}
                    {isActionDue && <Clock className="w-3.5 h-3.5 text-hazard-amber shrink-0" />}
                    {!isCritical && !isHigh && !isActionDue && <Info className="w-3.5 h-3.5 text-hazard-cyan shrink-0" />}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isCritical ? 'text-hazard-red' : isHigh ? 'text-hazard-amber' : isActionDue ? 'text-amber-400' : 'text-hazard-cyan'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-industrial-500">{item.timestamp}</span>
                </div>

                <div className="text-xs font-semibold text-industrial-100 mb-1 leading-snug group-hover:text-white">
                  {item.title}
                </div>

                <p className="text-[11px] text-industrial-400 font-sans leading-relaxed line-clamp-2">
                  {item.message}
                </p>

                {(item.report_id || item.action_id) && (
                  <div className="mt-2 pt-2 border-t border-industrial-800 flex items-center justify-between text-[10px] text-industrial-400">
                    <span className="font-mono text-hazard-cyan">
                      {item.report_id || item.action_id}
                    </span>
                    <span className="flex items-center gap-1 text-industrial-300 group-hover:text-hazard-cyan">
                      <span>INSPECT</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-industrial-800 bg-industrial-900 text-center text-[10px] text-industrial-500">
          ESCALATION PROTOCOL: IMMEDIATE HSSE SUPERVISOR NOTIFICATION
        </div>
      </div>
    </div>
  );
};

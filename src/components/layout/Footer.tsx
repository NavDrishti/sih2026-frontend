import React from 'react';
import { Terminal, Shield, Database, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-industrial-800 bg-industrial-950 text-industrial-400 font-mono text-xs py-3 px-4 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-industrial-300 font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-hazard-cyan" />
            <span>REFINERY SIF INTELLIGENCE • PROTOTYPE</span>
          </div>
          <span className="text-industrial-700 hidden sm:inline">|</span>
          <span className="text-industrial-500 text-[10px]">
            Seeded demonstration data — not live plant telemetry
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-industrial-400">
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3 text-industrial-500" />
            <span>SCHEMA: V2.4-SIF</span>
          </div>
          <div className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>LOCAL SYNC: 18ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-hazard-amber" />
            <span>IOGP LSR: 2026 EDITION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

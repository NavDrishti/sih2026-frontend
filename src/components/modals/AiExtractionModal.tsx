import React from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { SafetyReport } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface AiExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SafetyReport;
}

export const AiExtractionModal: React.FC<AiExtractionModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-4xl bg-industrial-950 border border-hazard-cyan-border shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-industrial-900 border-b border-industrial-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-hazard-cyan" />
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">
              AI EXTRACTION VIEW — UNSTRUCTURED TEXT TO REFINERY SIF DATA
            </h2>
          </div>
          <button onClick={onClose} className="text-industrial-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Side-by-Side (Section 20) */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Left Column: Raw Unstructured Narrative */}
          <div className="md:col-span-6 p-4 bg-industrial-900 border border-industrial-800 space-y-3">
            <div className="tech-label text-industrial-300 border-b border-industrial-800 pb-1.5 flex items-center justify-between">
              <span>RAW WORKER NARRATIVE (INPUT)</span>
              <span className="text-[10px] text-industrial-500">PLAIN TEXT / VOICE TRANSCRIPT</span>
            </div>
            <div className="p-3 bg-industrial-950 border border-industrial-850 text-industrial-200 font-sans text-xs leading-relaxed italic select-text">
              &ldquo;{report.raw_narrative}&rdquo;
            </div>
            <div className="text-[11px] text-industrial-400 space-y-1 pt-1">
              <div>• Reporter: {report.reporter_role || 'Field Operator'}</div>
              <div>• Source: Digital PTW & Observation Portal</div>
              <div>• Captured: {new Date(report.timestamp).toLocaleString()}</div>
            </div>
          </div>

          {/* Center arrow indicator on desktop */}
          {/* Right Column: AI Extracted Structured Entities */}
          <div className="md:col-span-6 p-4 bg-industrial-900 border border-hazard-cyan-border/60 space-y-3">
            <div className="tech-label text-hazard-cyan border-b border-industrial-800 pb-1.5 flex items-center justify-between">
              <span>AI EXTRACTED STRUCTURED ENTITIES</span>
              <span className="text-[10px] text-hazard-cyan font-bold">{report.confidence}% CONFIDENCE</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-industrial-950 border border-industrial-850">
                  <span className="text-industrial-500 block text-[9px] uppercase">Unit:</span>
                  <strong className="text-white font-mono">{report.unit}</strong>
                </div>
                <div className="p-2 bg-industrial-950 border border-industrial-850">
                  <span className="text-industrial-500 block text-[9px] uppercase">Equipment:</span>
                  <strong className="text-hazard-cyan font-mono">{report.equipment}</strong>
                </div>
                <div className="p-2 bg-industrial-950 border border-industrial-850">
                  <span className="text-industrial-500 block text-[9px] uppercase">Activity:</span>
                  <strong className="text-white font-mono">{report.activity}</strong>
                </div>
                <div className="p-2 bg-industrial-950 border border-industrial-850">
                  <span className="text-industrial-500 block text-[9px] uppercase">Hazard:</span>
                  <strong className="text-hazard-red font-mono">{report.hazards[0]}</strong>
                </div>
              </div>

              <div className="p-2.5 bg-industrial-950 border border-industrial-850 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-industrial-400">Barrier:</span>
                  <span className="text-white font-bold">{report.barriers[0]?.name || 'Energy Isolation'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-industrial-400">Barrier Status:</span>
                  <IndustrialBadge variant="critical" size="xs">
                    {report.barriers[0]?.status || 'FAILED'}
                  </IndustrialBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-industrial-400">Exposure:</span>
                  <span className="text-industrial-200">Worker direct line of fire</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-industrial-400">Potential Consequence:</span>
                  <span className="text-hazard-red font-bold">Burn / serious injury / SIF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-industrial-400">IOGP Rule:</span>
                  <span className="text-hazard-amber font-bold">{report.iogp_rule}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-industrial-850">
                  <span className="text-industrial-400">SIF Potential:</span>
                  <IndustrialBadge variant="critical" size="xs">
                    YES ({report.sif_score}/5)
                  </IndustrialBadge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-industrial-900 border-t border-industrial-800 flex items-center justify-between text-xs">
          <span className="text-industrial-500 text-[10px]">
            ALGORITHM: SIF-TRANSFORMER v2.4 (NAMED ENTITY RECOGNITION + HAZOP ONTOLOGY)
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-industrial-800 hover:bg-industrial-750 text-white border border-industrial-700 font-mono text-xs"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

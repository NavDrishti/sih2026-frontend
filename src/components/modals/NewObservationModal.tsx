import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Upload, 
  CheckCircle, 
  AlertOctagon, 
  X, 
  Cpu, 
  Activity, 
  Sparkles, 
  Camera, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  FileText
} from 'lucide-react';
import { RefineryUnit, ActivityType, SafetyReport } from '../../types/safety';
import { calculateSIFScore, generateSIFExplanations } from '../../services/sifScoringService';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface NewObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: SafetyReport) => void;
}

export const NewObservationModal: React.FC<NewObservationModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [narrative, setNarrative] = useState('');
  const [unit, setUnit] = useState<RefineryUnit>('DHT');
  const [activity, setActivity] = useState<ActivityType>('Line Breaking');
  const [equipment, setEquipment] = useState('P-204');
  const [reporterRole, setReporterRole] = useState('Senior Mechanical Technician');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // AI Pipeline Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [generatedReport, setGeneratedReport] = useState<SafetyReport | null>(null);

  const pipelineSteps = [
    'TRANSCRIPT GENERATED',
    'ENTITIES EXTRACTED',
    'HAZARD IDENTIFIED',
    'BARRIERS IDENTIFIED',
    'SIF PARAMETERS SCORED',
    'IOGP RULE MAPPED',
    'RISK CLASSIFICATION GENERATED'
  ];

  // Voice recording timer simulation
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    setIsRecording(true);
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    // Fill realistic voice transcript if empty
    if (!narrative.trim()) {
      setNarrative(
        "Voice Transcript: Technician cracked the companion bolts on the 6-inch discharge line at pump P-204 before checking the bleed valve. Small weeping of hot gas oil escalated into a pressurized spray onto the deck because the upstream block valve passed and no blind spade was swung."
      );
    }
  };

  // Generate automated ID formatted as REF-YYYYMMDD-XXXXXX
  const generateObservationId = (): string => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return `REF-${yyyy}${mm}${dd}-${randomHex}`;
  };

  const handleSubmit = () => {
    if (!narrative.trim()) return;

    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Realistic step-by-step pipeline sequence simulation
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < pipelineSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          finishProcessing();
          return prev;
        }
      });
    }, 450);
  };

  const finishProcessing = () => {
    const newId = generateObservationId();
    const defaultParams = {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: activity === 'Line Breaking' ? 5 : 3,
      controlVerification: 5,
      proximityToHazard: 4
    };

    const sifCalc = calculateSIFScore(defaultParams);
    const { whyFlagged, primaryEscalationTrigger } = generateSIFExplanations(
      defaultParams,
      ['Pressurized Hydrocarbon', 'Thermal Energy'],
      activity
    );

    const report: SafetyReport = {
      report_id: newId,
      timestamp: new Date().toISOString(),
      unit,
      equipment,
      equipment_full: `${equipment} PROCESS PIPING SPOOL`,
      activity,
      report_type: 'SIF Precursor',
      report_types: ['SIF Precursor', 'UC', 'UA'],
      raw_narrative: narrative,
      ai_summary: 'Hot pressurized hydrocarbon was released during line breaking because positive isolation and zero-energy verification were not completed.',
      confidence: 95,
      hazards: ['Pressurized Hydrocarbon', 'Hot Gasoil (180°C)', 'Line of Fire'],
      barriers: [
        { name: 'Double Block & Bleed', expected: 'Required', observed: 'Single valve only, passing', status: 'FAILED' },
        { name: 'Blind / Spade', expected: 'Required', observed: 'Missing, unswung', status: 'FAILED' },
        { name: 'Zero Energy Verification', expected: 'Required', observed: 'Not verified in field', status: 'FAILED' },
        { name: 'PPE', expected: 'Required', observed: 'Nomex worn', status: 'VERIFIED' }
      ],
      iogp_rule: 'Energy Isolation',
      sif_potential: true,
      sif_score: sifCalc.score,
      sif_classification: sifCalc.classification,
      severity: 'CRITICAL',
      p2h_rating: 'P2H 5/5',
      critical_control_failure: 'Energy isolation verification (DBB + zero energy proof)',
      causal_pathway: [
        { step: '01', name: 'HAZARD PRESENT', description: `Hot pressurized hydrocarbon in ${equipment} piping`, isCritical: false },
        { step: '02', name: 'BARRIER STATUS', description: 'FAILED — single valve passing; zero-energy omitted', isCritical: true },
        { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Flange bolts loosened prior to physical zero-proof check', isCritical: true },
        { step: '04', name: 'PHYSICAL MECHANISM', description: 'Pressurized release across flange gasket gap', isCritical: true },
        { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Technician directly in front of split flange', isCritical: true },
        { step: '06', name: 'POTENTIAL OUTCOME', description: 'Severe 3rd-degree burns / fatality potential', isCritical: true }
      ],
      sif_parameters: defaultParams,
      why_flagged: whyFlagged,
      primary_escalation_trigger: primaryEscalationTrigger,
      reporter_role: reporterRole,
      corrective_actions: [
        {
          action_id: `ACT-${newId.replace('REF-', '')}`,
          report_id: newId,
          description: `Immediately cease line breaking on ${equipment} until positive DBB isolation is reinstated and verified.`,
          priority: 'CRITICAL',
          owner: 'Unit Operations Shift Lead',
          unit,
          due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          status: 'OPEN'
        }
      ]
    };

    setGeneratedReport(report);
    setIsProcessing(false);
  };

  const handleCompleteFlow = () => {
    if (generatedReport) {
      onSubmitReport(generatedReport);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-2xl bg-industrial-950 border border-industrial-700 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-industrial-900 border-b border-industrial-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-hazard-red animate-critical-pulse" />
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">
              NEW SAFETY OBSERVATION INTAKE & AI INGESTION
            </h2>
          </div>
          <button onClick={onClose} className="text-industrial-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!generatedReport && !isProcessing && (
            <>
              {/* Form Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-industrial-400 uppercase block mb-1">
                    REFINERY UNIT *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as RefineryUnit)}
                    className="w-full bg-industrial-900 border border-industrial-800 p-2 text-white font-mono text-xs focus:outline-hidden focus:border-hazard-cyan"
                  >
                    {['DHT', 'FCC', 'SRU', 'CDU', 'Tank Farm', 'Hydrocracker', 'VDU', 'NHT'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 uppercase block mb-1">
                    ACTIVITY CLASS *
                  </label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as ActivityType)}
                    className="w-full bg-industrial-900 border border-industrial-800 p-2 text-white font-mono text-xs focus:outline-hidden focus:border-hazard-cyan"
                  >
                    {[
                      'Line Breaking',
                      'Maintenance',
                      'Hot Work',
                      'Confined Space Entry',
                      'Startup',
                      'Shutdown',
                      'Lifting',
                      'Routine Operations'
                    ].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 uppercase block mb-1">
                    EQUIPMENT TAG *
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. P-204, R-201..."
                    className="w-full bg-industrial-900 border border-industrial-800 p-2 text-white font-mono text-xs focus:outline-hidden focus:border-hazard-cyan"
                  />
                </div>
              </div>

              {/* Primary Narrative Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-industrial-400 uppercase">
                    WORKER OBSERVATION NARRATIVE (VERBATIM CAPTURE) *
                  </label>
                  <span className="text-[10px] text-industrial-500">
                    DESCRIBE EXACT EVENT SEQUENCE & BARRIERS
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Describe what happened: e.g., 'During flange opening on feed pump P-204, hot gas oil escaped when companion studs were loosened because the upstream isolation valve passed and zero-energy wasn't checked...'"
                  className="w-full bg-industrial-900 border border-industrial-800 p-3 text-white font-sans text-xs placeholder-industrial-500 focus:outline-hidden focus:border-hazard-cyan leading-relaxed"
                />
              </div>

              {/* Multi-modal inputs: Voice & Photo (Section 19) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Voice Input */}
                <div className="p-3 bg-industrial-900 border border-industrial-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-industrial-400 uppercase flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-hazard-red" />
                      VOICE RECORDER INGESTION
                    </span>
                    {isRecording && (
                      <span className="text-[10px] text-hazard-red font-bold animate-pulse">
                        REC [{recordingSeconds}s]
                      </span>
                    )}
                  </div>

                  {/* Simulated Waveform if recording */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 py-1 h-7">
                      {[12, 24, 8, 28, 16, 32, 20, 10, 26, 14, 30, 18, 8].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-hazard-red animate-pulse"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartVoice}
                        className="flex-1 py-1.5 px-2.5 bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 flex items-center justify-center gap-1.5 text-xs transition"
                      >
                        <Mic className="w-3.5 h-3.5 text-hazard-red" />
                        <span>RECORD VOICE</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopVoice}
                        className="flex-1 py-1.5 px-2.5 bg-hazard-red hover:bg-red-600 text-white font-bold flex items-center justify-center gap-1.5 text-xs transition animate-pulse"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>STOP RECORDING</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Photo Attachment */}
                <div className="p-3 bg-industrial-900 border border-industrial-800 space-y-2">
                  <span className="text-[10px] text-industrial-400 uppercase flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-hazard-cyan" />
                    FIELD PHOTOGRAPH ATTACHMENT
                  </span>
                  <div
                    onClick={() => setPhotoUploaded(!photoUploaded)}
                    className="border border-dashed border-industrial-700 hover:border-hazard-cyan p-2.5 text-center cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-industrial-500" />
                    <span className="text-[11px] text-industrial-300">
                      {photoUploaded ? 'PHOTO ATTACHED: P-204_FLANGE.JPG ✓' : 'CLICK TO SIMULATE PHOTO UPLOAD'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* AI PROCESSING SEQUENCE (Section 19) */}
          {isProcessing && (
            <div className="py-6 space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 bg-hazard-red-dark border border-hazard-red text-hazard-red shadow-hazard-red animate-pulse">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                  AI SAFETY INTELLIGENCE PIPELINE EXECUTING
                </h3>
                <p className="text-xs text-industrial-400 font-sans">
                  Extracting hazards, assessing barrier hierarchies, and computing SIF precursor score
                </p>
              </div>

              {/* 7-Step Vertical Sequence with dynamic animations */}
              <div className="max-w-md mx-auto space-y-2 pt-2">
                {pipelineSteps.map((stepName, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={stepName}
                      className={`p-2.5 border transition-all flex items-center justify-between text-xs ${
                        isDone
                          ? 'bg-industrial-900 border-hazard-green-border text-emerald-300'
                          : isCurrent
                          ? 'bg-hazard-red-dark/40 border-hazard-red text-white shadow-hazard-red animate-pulse'
                          : 'bg-industrial-950 border-industrial-850 text-industrial-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] w-5">0{idx + 1}</span>
                        <span className="font-bold tracking-wider">{stepName}</span>
                      </div>
                      <div>
                        {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {isCurrent && <Sparkles className="w-4 h-4 text-hazard-red animate-spin" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STRUCTURED RESULT VIEW (Section 20 AI Extraction View preview) */}
          {generatedReport && (
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-hazard-red-dark/30 border border-hazard-red flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-red-300 uppercase font-bold">
                    PRECURSOR DETECTED & CLASSIFIED
                  </div>
                  <div className="text-base font-black text-white">
                    {generatedReport.report_id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-industrial-400 uppercase">SIF SCORE</div>
                  <div className="text-base font-black text-hazard-red">
                    {generatedReport.sif_score} / 5.0
                  </div>
                </div>
              </div>

              {/* AI EXTRACTION VIEW SIDE-BY-SIDE (Section 20) */}
              <div className="p-3 bg-industrial-900 border border-industrial-800 space-y-2">
                <div className="tech-label text-hazard-cyan border-b border-industrial-800 pb-1">
                  AI EXTRACTION VIEW — UNSTRUCTURED TO STRUCTURED MAPPING
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                  <div className="p-1.5 bg-industrial-950 border border-industrial-850">
                    <span className="text-industrial-500 block text-[9px]">UNIT:</span>
                    <strong className="text-white">{generatedReport.unit}</strong>
                  </div>
                  <div className="p-1.5 bg-industrial-950 border border-industrial-850">
                    <span className="text-industrial-500 block text-[9px]">EQUIPMENT:</span>
                    <strong className="text-hazard-cyan">{generatedReport.equipment}</strong>
                  </div>
                  <div className="p-1.5 bg-industrial-950 border border-industrial-850">
                    <span className="text-industrial-500 block text-[9px]">ACTIVITY:</span>
                    <strong className="text-white">{generatedReport.activity}</strong>
                  </div>
                  <div className="p-1.5 bg-industrial-950 border border-industrial-850">
                    <span className="text-industrial-500 block text-[9px]">IOGP RULE:</span>
                    <strong className="text-hazard-amber">{generatedReport.iogp_rule}</strong>
                  </div>
                </div>

                <div className="p-2 bg-industrial-950 border border-industrial-850 text-xs">
                  <span className="text-industrial-500 block text-[10px] uppercase">AI SUMMARY:</span>
                  <p className="text-industrial-200 font-sans mt-0.5">&ldquo;{generatedReport.ai_summary}&rdquo;</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-industrial-900 border-t border-industrial-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-industrial-800 hover:bg-industrial-750 text-industrial-300 text-xs font-mono transition"
          >
            CANCEL
          </button>

          {!generatedReport && !isProcessing ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!narrative.trim()}
              className="px-4 py-1.5 bg-hazard-red hover:bg-red-600 disabled:bg-industrial-800 disabled:text-industrial-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-hazard-red transition"
            >
              <span>SUBMIT OBSERVATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : generatedReport ? (
            <button
              type="button"
              onClick={handleCompleteFlow}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
            >
              <span>ACCEPT & OPEN INVESTIGATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

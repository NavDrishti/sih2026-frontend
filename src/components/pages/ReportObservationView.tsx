import React, { useState, useEffect } from 'react';
import {
  Mic,
  Type,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  RotateCcw,
  Check,
  Edit3,
  Flame,
  Volume2,
  FileCheck2
} from 'lucide-react';
import { SentinelObservation, SAMPLE_INCIDENT_INPUTS } from '../../data/sentinelData';
import { IOGPRule } from '../../types/safety';

interface ReportObservationViewProps {
  onAddObservation: (newObs: SentinelObservation) => void;
  onSelectObservation: (obs: SentinelObservation) => void;
}

export const ReportObservationView: React.FC<ReportObservationViewProps> = ({
  onAddObservation,
  onSelectObservation
}) => {
  const [reportMode, setReportMode] = useState<'type' | 'voice'>('type');
  const [reportText, setReportText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [analyzedResult, setAnalyzedResult] = useState<SentinelObservation | null>(null);
  const [reviewDecision, setReviewDecision] = useState<string | null>(null);

  // Cycle sample reports
  const handleTrySample = () => {
    const randomSample = SAMPLE_INCIDENT_INPUTS[Math.floor(Math.random() * SAMPLE_INCIDENT_INPUTS.length)];
    setReportText(randomSample.text);
    setAnalyzedResult(null);
    setActivePipelineStep(0);
    setReviewDecision(null);
  };

  const handleSelectSample = (sample: { title: string; text: string }) => {
    setReportText(sample.text);
    setAnalyzedResult(null);
    setActivePipelineStep(0);
    setReviewDecision(null);
  };

  // Voice recording simulation with Web Speech API fallback
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setReportText(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsRecording(false);
          };

          recognition.onerror = () => {
            simulateVoiceInput();
          };

          recognition.start();
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      setReportText("During maintenance on pump P-301 in Refinery Unit 3, I noticed the lockout-tagout was not verified before the technician started working. The isolation permit was signed but nobody physically confirmed the valve was closed.");
      setIsRecording(false);
    }, 2800);
  };

  // Trigger AI pipeline simulation
  const handleAnalyzeWithAi = () => {
    if (!reportText.trim()) return;

    setIsProcessing(true);
    setAnalyzedResult(null);
    setReviewDecision(null);
    setActivePipelineStep(1); // Raw Report

    setTimeout(() => {
      setActivePipelineStep(2); // Extraction
    }, 600);

    setTimeout(() => {
      setActivePipelineStep(3); // SIF Assessment
    }, 1300);

    setTimeout(() => {
      setActivePipelineStep(4); // Life-Saving Rule
    }, 2000);

    setTimeout(() => {
      setActivePipelineStep(5); // Precursor Detection
    }, 2700);

    setTimeout(() => {
      setIsProcessing(false);
      // Generate structured intelligence based on input
      const generated: SentinelObservation = buildObservationFromText(reportText);
      setAnalyzedResult(generated);
    }, 3200);
  };

  const buildObservationFromText = (text: string): SentinelObservation => {
    const lower = text.toLowerCase();

    const isLifting = lower.includes('crane') || lower.includes('lift') || lower.includes('rigg') || lower.includes('load');
    const isHotWork = lower.includes('weld') || lower.includes('hot work') || lower.includes('torch') || lower.includes('grind');
    const isConfined = lower.includes('confined') || lower.includes('tank') || lower.includes('vessel') || lower.includes('sump');
    const isHeight = lower.includes('height') || lower.includes('scaffold') || lower.includes('fall') || lower.includes('ladder');

    let rule: IOGPRule = 'Energy Isolation';
    let activity = 'Maintenance';
    let site = 'Refinery Unit 3';
    let hazard = 'Pressurized Hydrocarbon & Stored Energy';
    let actualOutcome = 'Near Miss (No Injury)';
    let potentialOutcome = 'Fatal Injury';
    let sifScore = 88;
    let precursorTags = ['Missing isolation verification', 'Contractor oversight'];

    if (isLifting) {
      rule = 'Safe Mechanical Lifting';
      activity = 'Lifting Operation';
      site = 'Refinery Unit 3';
      hazard = 'Suspended Load Drop (Crush Hazard)';
      actualOutcome = 'Near Miss (Workers Cleared in Time)';
      potentialOutcome = 'Fatal Crush Injury';
      sifScore = 91;
      precursorTags = ['Workers entering lifting exclusion zones', 'Contractor-related recurring risks'];
    } else if (isHotWork) {
      rule = 'Hot Work';
      activity = 'Hot Work';
      site = 'North Gas Plant';
      hazard = 'Vapor Cloud Explosion (VCE) / Hydrocarbon Flash Fire';
      actualOutcome = 'Near Miss (Auditor Halted Torch)';
      potentialOutcome = 'Multiple Fatalities';
      sifScore = 95;
      precursorTags = ['Permit-to-work gaps', 'Bypassing safety controls'];
    } else if (isConfined) {
      rule = 'Confined Space';
      activity = 'Confined Space Entry';
      site = 'Crude Terminal';
      hazard = 'Toxic Gas Inhalation (H2S) & Asphyxiation';
      actualOutcome = 'Near Miss (Entry Blocked at Manway)';
      potentialOutcome = 'Multiple Fatalities';
      sifScore = 93;
      precursorTags = ['Atmospheric test omission', 'Permit-to-work gaps'];
    } else if (isHeight) {
      rule = 'Working at Height';
      activity = 'Working at Height';
      site = 'South Tank Farm';
      hazard = 'Fall from Height (>10m)';
      actualOutcome = 'No Injury (Worker Re-hooked)';
      potentialOutcome = 'Fatal Fall Impact';
      sifScore = 89;
      precursorTags = ['Working at height non-compliance', 'Contractor-related recurring risks'];
    }

    const obsId = `OBS-2026-01${Math.floor(Math.random() * 50 + 43)}`;

    return {
      report_id: obsId,
      timestamp: new Date().toISOString(),
      unit: 'DHT',
      site,
      equipment: 'P-301 / Live Processing Line',
      equipment_full: `${site} Primary Operating Unit`,
      activity: activity as any,
      report_type: 'Near Miss',
      report_types: ['Near Miss', 'SIF Precursor'],
      raw_narrative: text,
      ai_summary: `AI classified high-potential risk under ${rule}. Critical safeguard verification omitted during ${activity}.`,
      confidence: 94,
      hazards: [hazard, 'Lack of verified positive control barrier'],
      barriers: [
        { name: 'Primary Control Barrier', expected: 'Mandatory Verification', observed: 'Omitted before task execution', status: 'FAILED', controlType: 'Engineering' },
        { name: 'Permit-to-Work Verification', expected: 'Active on Site', observed: 'Procedural non-compliance detected', status: 'NOT_VERIFIED', controlType: 'Administrative' }
      ],
      iogp_rule: rule,
      sif_potential: true,
      sif_score: sifScore,
      sif_classification: sifScore >= 90 ? 'IMMINENT SIF POTENTIAL' : 'HIGH SIF POTENTIAL',
      severity: 'CRITICAL',
      actual_outcome: actualOutcome,
      potential_consequence: `${potentialOutcome} from catastrophic release / energy discharge`,
      potential_outcome: potentialOutcome,
      precursor_tags: precursorTags,
      review_status: 'Under Review',
      status: 'Open',
      causal_pathway: [
        { step: '1', name: 'Work Preparation', description: 'Permit signed without physical site verification', isCritical: true },
        { step: '2', name: 'Execution Initiation', description: 'Technician placed body into line-of-fire envelope', isCritical: true }
      ],
      sif_parameters: {
        energyReleasePotential: 5,
        barrierFailure: 4,
        workerExposure: 5,
        hazardousMaterial: 4,
        lineBreaking: 3,
        controlVerification: 4,
        proximityToHazard: 5
      },
      why_flagged: ['Direct bodily exposure to high-energy source', 'Barrier verification breakdown'],
      primary_escalation_trigger: `SIF Potential ${sifScore} with ${rule} exposure`,
      corrective_actions: []
    };
  };

  const handleReviewAction = (decision: 'Confirmed' | 'Needs Investigation' | 'Escalated' | 'Edit') => {
    if (!analyzedResult) return;
    setReviewDecision(decision);

    if (decision !== 'Edit') {
      const updated: SentinelObservation = {
        ...analyzedResult,
        review_status: decision,
        status: decision
      };
      setAnalyzedResult(updated);
      onAddObservation(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Split: Submit Observation vs AI Processing Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submit Safety Report (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Submit Safety Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Natural language — voice or text
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setReportMode('type')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  reportMode === 'type'
                    ? 'bg-white dark:bg-[#131f37] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Type Report</span>
              </button>
              <button
                type="button"
                onClick={() => setReportMode('voice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  reportMode === 'voice'
                    ? 'bg-white dark:bg-[#131f37] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Report</span>
              </button>
            </div>
          </div>

          {/* Voice Ingestion Assistant Panel */}
          {reportMode === 'voice' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200 dark:ring-red-900/50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {isRecording ? 'Listening... speak clearly into your microphone' : 'Tap to start voice recording'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  AI will transcribe audio in real-time and extract safety parameters
                </p>
              </div>
            </div>
          )}

          {/* Input Textarea */}
          <div className="relative">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the safety observation in your own words... e.g. 'During maintenance on pump P-301, the lockout-tagout was not verified before the technician started working...'"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs sm:text-sm leading-relaxed transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isProcessing || !reportText.trim()}
              onClick={handleAnalyzeWithAi}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all ${
                isProcessing || !reportText.trim()
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Analyzing...' : 'Analyze with AI'}</span>
            </button>

            <button
              type="button"
              onClick={handleTrySample}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Try Sample
            </button>
          </div>

          {/* Sample Reports Picker */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              SAMPLE REPORTS
            </span>
            <div className="space-y-2">
              {SAMPLE_INCIDENT_INPUTS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
                >
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {sample.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {sample.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Processing Pipeline (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Processing Pipeline
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Report → Extraction → SIF → LSR → Precursors
              </p>
            </div>
          </div>

          {/* 5-Step Pipeline List */}
          <div className="space-y-3 pt-2">
            {[
              {
                step: 1,
                name: 'Raw Report',
                desc: 'Natural language safety observation received',
                icon: Type
              },
              {
                step: 2,
                name: 'Extraction',
                desc: 'Extracting incident type, site, activity, hazard, energy source...',
                icon: FileCheck2
              },
              {
                step: 3,
                name: 'SIF Assessment',
                desc: 'Assessing SIF potential and calculating SIF score...',
                icon: AlertOctagon
              },
              {
                step: 4,
                name: 'Life-Saving Rule',
                desc: 'Mapping to IOGP Life-Saving Rules and barrier failures...',
                icon: ShieldCheck
              },
              {
                step: 5,
                name: 'Precursor Detection',
                desc: 'Detecting recurring precursor patterns...',
                icon: AlertTriangle
              }
            ].map((item) => {
              const isCompleted = activePipelineStep > item.step || (analyzedResult && !isProcessing);
              const isActive = activePipelineStep === item.step && isProcessing;
              const isPending = activePipelineStep < item.step && !analyzedResult;

              return (
                <div
                  key={item.step}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isCompleted
                      ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-950 dark:text-emerald-200'
                      : isActive
                      ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm animate-pulse'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] flex items-center justify-center font-bold text-slate-400">
                        {item.step}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Structured AI Analysis Results */}
      {analyzedResult && (
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {analyzedResult.report_id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 uppercase">
                  AI Analysis Complete
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Confidence: {analyzedResult.confidence}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {analyzedResult.ai_summary}
              </p>
            </div>

            {/* Quick SIF Badge */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-red-500 tracking-wider">
                    SIF Potential
                  </div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-300">
                    Score: {analyzedResult.sif_score} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CRITICAL USER REQUIREMENT: Separate Actual Outcome from Potential Outcome! */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Actual Outcome Banner */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                ACTUAL OUTCOME
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {analyzedResult.actual_outcome}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                What physically occurred on site at time of observation (No fatal impact or injury).
              </p>
            </div>

            {/* Potential Outcome Banner */}
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                POTENTIAL OUTCOME &bull; SIF POTENTIAL
              </div>
              <div className="text-base font-bold text-red-700 dark:text-red-400 mt-1">
                {analyzedResult.potential_outcome}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Credible consequence if remaining barrier or timing failed: {analyzedResult.potential_consequence}.
              </p>
            </div>
          </div>

          {/* Key-Value Extracted Fields Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Incident Type</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {analyzedResult.report_type}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Site / Location</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {analyzedResult.site}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Activity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {analyzedResult.activity}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Life-Saving Rule</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                {analyzedResult.iogp_rule}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Hazard / Energy Source</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {analyzedResult.hazards.join(', ')}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Barrier Failure</span>
              <span className="font-bold text-red-600 dark:text-red-400 mt-0.5 block">
                {analyzedResult.barriers[0]?.name}: {analyzedResult.barriers[0]?.observed}
              </span>
            </div>
          </div>

          {/* Precursor Tags */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              DETECTED PRECURSORS
            </span>
            <div className="flex flex-wrap gap-2">
              {analyzedResult.precursor_tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                >
                  ⚠ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Human Review Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Human Review:
              </span>
              {reviewDecision ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Status: {reviewDecision}
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Select review determination to store in safety database
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleReviewAction('Confirmed')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>

              <button
                type="button"
                onClick={() => handleReviewAction('Needs Investigation')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Needs Investigation</span>
              </button>

              <button
                type="button"
                onClick={() => handleReviewAction('Escalated')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Escalate</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectObservation(analyzedResult)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Open Full Detail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

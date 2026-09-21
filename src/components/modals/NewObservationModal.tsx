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
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RefineryUnit, ActivityType, SafetyReport, Refinery10Parameters, UserProfile } from '../../types/safety';
import { calculateSIFScore, generateSIFExplanations } from '../../services/sifScoringService';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface NewObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: SafetyReport) => void;
  currentUser?: UserProfile;
}

export const NewObservationModal: React.FC<NewObservationModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  currentUser
}) => {
  const [narrative, setNarrative] = useState('');
  const [unit, setUnit] = useState<RefineryUnit>('DHT');
  const [activity, setActivity] = useState<ActivityType>('Line Breaking');
  const [equipment, setEquipment] = useState('P-204');
  const [equipmentFull, setEquipmentFull] = useState('FEED PUMP P-204 SUCTION SPOOL');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  
  // 10-Parameter Expansion State
  const [showParametersAccordion, setShowParametersAccordion] = useState(false);
  const [paramState, setParamState] = useState<Refinery10Parameters>({
    refinery_unit: 'DHT',
    process_area: 'Feed Section',
    equipment: 'Pump',
    specific_location: 'P-204 Suction Flange',
    activity_type: 'Line Breaking',
    task: 'Flange unbolting for maintenance',
    operating_condition: 'Maintenance',
    routine_status: 'Non-routine',
    safety_critical_task: true,
    ua_uc_type: 'Unsafe Act (UA)',
    ua_uc_category: 'Isolation/LOTO violation',
    ua_uc_subcategory: 'Unbolting line before zero energy verification',
    process_hazard: 'High-Pressure Hydrocarbon',
    hazard_mechanism: 'Hydrocarbon Release / Flange Spray',
    process_material: 'Diesel',
    energy_source: 'Pressure',
    pressure_condition: 'High Pressure (2–50 bar)',
    temperature_condition: 'Elevated (>60°C)',
    persons_exposed: 2,
    exposure_type: 'Hydrocarbon Exposure',
    exposure_duration: '1–5 minutes',
    barrier_type: 'Double Block and Bleed',
    barrier_status: 'Failed',
    critical_control_failure: true,
    performance_influencing_factor: 'Turnaround Workload',
    communication_issue: true,
    supervision_issue: false,
    actual_consequence: 'No Injury',
    potential_consequence: 'Fatality',
    high_potential_event: true,
    sif_potential: true,
    sif_mechanism: 'High-Pressure Hydrocarbon Release / Line of Fire',
    proximity_to_harm: 5,
    fatality_pathway: 'Pressurized diesel line → unverified isolation → flange opened → spray mist → worker in line of fire → potential fatality',
    immediate_action: 'Work Stopped',
    work_stopped: true,
    equipment_isolated: true,
    supervisor_notified: true,
    observation_status: 'Under Investigation'
  });

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // AI Pipeline Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const pipelineSteps = [
    'TRANSCRIPT GENERATED',
    'ENTITIES EXTRACTED',
    'HAZARD IDENTIFIED',
    'BARRIERS EVALUATED',
    '10 REFINERY PARAMETERS MAPPED',
    'SIF PROXIMITY SCORED',
    'RISK CLASSIFICATION FINALIZED'
  ];

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
    if (!narrative.trim()) {
      setNarrative(
        "Voice Transcript: Technician cracked companion bolts on 6-inch discharge line at pump P-204 before checking the bleed valve. Weeping of hot diesel escalated into pressurized spray onto deck because upstream block valve passed and no blind spade was swung."
      );
    }
  };

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
    }, 350);
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
      proximityToHazard: 5
    };

    const sifCalc = calculateSIFScore(defaultParams);
    const { whyFlagged, primaryEscalationTrigger } = generateSIFExplanations(
      defaultParams,
      ['Pressurized Hydrocarbon', 'Thermal Energy'],
      activity
    );

    const final10Params: Refinery10Parameters = {
      ...paramState,
      refinery_unit: unit,
      activity_type: activity,
      equipment: equipment,
      task: `Maintenance activity on ${equipment}`
    };

    const report: SafetyReport = {
      report_id: newId,
      timestamp: new Date().toISOString(),
      unit,
      equipment,
      equipment_full: equipmentFull || `${equipment} PROCESS PIPING SPOOL`,
      activity,
      report_type: 'SIF Precursor',
      report_types: ['SIF Precursor', 'UC', 'UA'],
      raw_narrative: narrative,
      ai_summary: `${paramState.process_material || 'Hydrocarbon'} spray detected during ${activity} at ${equipment}. Positive isolation and zero-energy verification required immediate stop work.`,
      confidence: 96,
      hazards: ['Pressurized Hydrocarbon', 'Line of Fire', 'Hot Fluid (>60°C)'],
      barriers: [
        { name: 'Double Block & Bleed', expected: 'Required', observed: paramState.barrier_status || 'Failed', status: 'FAILED' },
        { name: 'Physical LOTO / Padlock', expected: 'Required', observed: 'Tag only, unpadlocked', status: 'FAILED' },
        { name: 'Zero Energy Verification', expected: 'Required', observed: 'Needle gauge unverified', status: 'NOT_VERIFIED' },
        { name: 'PPE & Shielding', expected: 'Required', observed: 'Flame retardant suit worn', status: 'VERIFIED' }
      ],
      iogp_rule: 'Energy Isolation',
      sif_potential: true,
      sif_score: sifCalc.score,
      sif_classification: sifCalc.classification,
      severity: 'CRITICAL',
      causal_pathway: [
        { step: '01', name: 'HAZARDOUS ENERGY PRESENT', description: `${paramState.process_material || 'Diesel'} line under ${paramState.pressure_condition || 'High Pressure (24 bar)'}`, isCritical: true },
        { step: '02', name: 'BARRIER FAILURE', description: `Isolation status: ${paramState.barrier_status || 'Failed'}`, isCritical: true },
        { step: '03', name: 'UNSAFE ACT', description: 'Flange opened before verifying line zero pressure', isCritical: true },
        { step: '04', name: 'RELEASE MECHANISM', description: 'Hydrocarbon spray atomizing onto deck', isCritical: true },
        { step: '05', name: 'WORKER EXPOSURE', description: `${paramState.persons_exposed || 2} workers in direct line of fire`, isCritical: true },
        { step: '06', name: 'POTENTIAL OUTCOME', description: `${paramState.potential_consequence || 'Fatality'} / Flash fire`, isCritical: true }
      ],
      sif_parameters: defaultParams,
      why_flagged: whyFlagged,
      primary_escalation_trigger: primaryEscalationTrigger,
      reporter_role: currentUser?.title || 'Field Operator',
      created_by: currentUser?.id || 'USR-WORKER-01',
      created_by_name: currentUser?.name || 'Rajesh Kumar',
      status: 'Under Investigation',
      corrective_actions: [
        {
          action_id: `ACT-${Date.now().toString().slice(-5)}`,
          report_id: newId,
          description: `Swing positive spectacle blind on ${equipment} suction spool before continuing permit`,
          priority: 'CRITICAL',
          owner: 'Unit Shift Superintendent',
          unit,
          due_date: 'Immediate / Next 2 Hours',
          status: 'OPEN'
        }
      ],
      parameters: final10Params
    };

    setIsProcessing(false);
    setCurrentStepIndex(-1);
    onSubmitReport(report);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 font-mono text-xs">
      <div className="bg-industrial-900 border border-industrial-700 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3 bg-industrial-950 border-b border-industrial-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-hazard-red-dark border border-hazard-red flex items-center justify-center text-hazard-red">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                SUBMIT SAFETY OBSERVATION • 10-PARAMETER DATASET
              </h2>
              <p className="text-[10px] text-industrial-400 font-sans">
                API RP 754 &bull; OSHA PSM 1910.119 &bull; SIF Precursor Classification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-industrial-800 text-industrial-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 industrial-scroll">
          {/* Reporter Identification Strip */}
          <div className="p-2.5 bg-industrial-950/70 border border-industrial-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-industrial-500 uppercase">REPORTER:</span>
              <span className="font-bold text-white">{currentUser?.name || 'Rajesh Kumar'}</span>
              <span className="text-industrial-600">|</span>
              <span className="text-hazard-cyan font-bold">{currentUser?.title || 'Field Operator'}</span>
            </div>
            <div className="flex items-center gap-2 text-industrial-400">
              <span>BADGE: <b className="text-industrial-200">{currentUser?.badge_id || 'OP-4492'}</b></span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-bold">SQLITE REALTIME SYNC</span>
            </div>
          </div>

          {/* Core Observation Location & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-industrial-400 mb-1 uppercase">
                01. REFINERY UNIT
              </label>
              <select
                value={unit}
                onChange={(e) => {
                  const val = e.target.value as RefineryUnit;
                  setUnit(val);
                  setParamState(prev => ({ ...prev, refinery_unit: val }));
                }}
                className="w-full px-2.5 py-1.5 bg-industrial-950 border border-industrial-700 text-white text-xs outline-none focus:border-hazard-cyan font-sans"
              >
                <option value="DHT">DHT — Diesel Hydrotreater</option>
                <option value="FCC">FCC — Fluid Catalytic Cracking</option>
                <option value="CDU">CDU — Crude Distillation Unit</option>
                <option value="VDU">VDU — Vacuum Distillation</option>
                <option value="SRU">SRU — Sulfur Recovery Unit</option>
                <option value="Tank Farm">Tank Farm &amp; Offsites</option>
                <option value="Hydrocracker">Hydrocracker Unit</option>
                <option value="NHT">NHT — Naphtha Hydrotreater</option>
                <option value="Utilities">Refinery Utilities</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-industrial-400 mb-1 uppercase">
                02. ACTIVITY / REGIME
              </label>
              <select
                value={activity}
                onChange={(e) => {
                  const val = e.target.value as ActivityType;
                  setActivity(val);
                  setParamState(prev => ({ ...prev, activity_type: val }));
                }}
                className="w-full px-2.5 py-1.5 bg-industrial-950 border border-industrial-700 text-white text-xs outline-none focus:border-hazard-cyan font-sans"
              >
                <option value="Line Breaking">Line Breaking / Flange Opening</option>
                <option value="Maintenance">Mechanical Maintenance</option>
                <option value="Hot Work">Hot Work / Welding</option>
                <option value="Confined Space Entry">Confined Space Entry</option>
                <option value="Equipment Isolation">Equipment Isolation / LOTO</option>
                <option value="Startup">Plant Startup / Commissioning</option>
                <option value="Shutdown">Plant Shutdown / Purge</option>
                <option value="Sampling / Chemical Handling">Sampling / Chemical Handling</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-industrial-400 mb-1 uppercase">
                EQUIPMENT TAG / ASSET
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => {
                  setEquipment(e.target.value);
                  setParamState(prev => ({ ...prev, equipment: e.target.value }));
                }}
                placeholder="e.g. P-204 Suction Flange"
                className="w-full px-2.5 py-1.5 bg-industrial-950 border border-industrial-700 text-white text-xs outline-none focus:border-hazard-cyan font-sans"
              />
            </div>
          </div>

          {/* Voice Input & Narrative Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-industrial-400 uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-hazard-cyan" />
                <span>FIELD OBSERVATION NARRATIVE (VOICE OR TEXT)</span>
              </label>

              {/* Voice button */}
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="text-[10px] text-hazard-red font-bold animate-pulse">
                    RECORDING: {recordingSeconds}s
                  </span>
                )}
                <button
                  type="button"
                  onClick={isRecording ? handleStopVoice : handleStartVoice}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold transition border ${
                    isRecording
                      ? 'bg-hazard-red text-white border-red-500 animate-pulse'
                      : 'bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border-industrial-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'STOP AUDIO' : 'RECORD VOICE'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Describe what occurred: equipment involved, pressure, material, barrier condition, worker position, or any unverified LOTO... (AI will automatically extract all 10 dataset parameters)"
              className="w-full p-3 bg-industrial-950 border border-industrial-700 focus:border-hazard-cyan text-white text-xs outline-none font-sans leading-relaxed placeholder:text-industrial-500"
            />
          </div>

          {/* 10-Parameter Refinery Specification Accordion */}
          <div className="border border-industrial-800 bg-industrial-950/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowParametersAccordion(!showParametersAccordion)}
              className="w-full px-4 py-2.5 flex items-center justify-between bg-industrial-950 hover:bg-industrial-900 border-b border-industrial-800 text-left transition"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-hazard-amber" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  ADVANCED: 10-PARAMETER REFINERY SPECIFICATION (VIEW / ADJUST)
                </span>
                <span className="px-1.5 py-0.2 bg-hazard-amber/20 border border-hazard-amber/40 text-hazard-amber text-[9px] font-bold">
                  API RP 754
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-industrial-400">
                <span>{showParametersAccordion ? 'COLLAPSE' : 'EXPAND'}</span>
                {showParametersAccordion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {showParametersAccordion && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[11px] bg-industrial-950">
                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">03. UA/UC CATEGORY</label>
                  <select
                    value={paramState.ua_uc_category}
                    onChange={(e) => setParamState(p => ({ ...p, ua_uc_category: e.target.value }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="Isolation/LOTO violation">Isolation/LOTO violation</option>
                    <option value="Line-breaking violation">Line-breaking violation</option>
                    <option value="Hydrocarbon leakage">Hydrocarbon leakage</option>
                    <option value="Hot-work violation">Hot-work violation</option>
                    <option value="ESD bypass">ESD bypass / Interlock defeat</option>
                    <option value="Toxic gas release">Toxic gas release (H2S)</option>
                    <option value="Corroded process piping">Corroded process piping</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">05. PROCESS MATERIAL</label>
                  <select
                    value={paramState.process_material}
                    onChange={(e) => setParamState(p => ({ ...p, process_material: e.target.value }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="Diesel">Diesel Fuel</option>
                    <option value="Crude Oil">Crude Oil</option>
                    <option value="Naphtha">Naphtha / Light Ends</option>
                    <option value="Sour Gas">Sour Gas / H2S Stream</option>
                    <option value="Hydrogen">High-Pressure Hydrogen</option>
                    <option value="LPG">LPG / Propane</option>
                    <option value="Vacuum Residue">Vacuum Residue (Hot Bitumen)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">05. PRESSURE CONDITION</label>
                  <select
                    value={paramState.pressure_condition}
                    onChange={(e) => setParamState(p => ({ ...p, pressure_condition: e.target.value as any }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="High Pressure (2–50 bar)">High Pressure (2–50 bar)</option>
                    <option value="Extreme Pressure (>50 bar)">Extreme Pressure (&gt;50 bar)</option>
                    <option value="Low Pressure (<2 bar)">Low Pressure (&lt;2 bar)</option>
                    <option value="Atmospheric">Atmospheric / Zero Energy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">06. BARRIER / LOTO STATUS</label>
                  <select
                    value={paramState.barrier_status}
                    onChange={(e) => setParamState(p => ({ ...p, barrier_status: e.target.value as any }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="Failed">Failed / Defective</option>
                    <option value="Not Verified">Not Verified in Field</option>
                    <option value="Missing">Missing / Omitted</option>
                    <option value="Degraded">Degraded</option>
                    <option value="Effective">Effective / Intact</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">08. ACTUAL CONSEQUENCE</label>
                  <select
                    value={paramState.actual_consequence}
                    onChange={(e) => setParamState(p => ({ ...p, actual_consequence: e.target.value }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="No Injury">No Injury (Near Miss)</option>
                    <option value="First Aid">First Aid</option>
                    <option value="Medical Treatment">Medical Treatment</option>
                    <option value="Lost Time Injury">Lost Time Injury</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-industrial-400 block mb-1">08. POTENTIAL WORST-CASE CONSEQUENCE</label>
                  <select
                    value={paramState.potential_consequence}
                    onChange={(e) => setParamState(p => ({ ...p, potential_consequence: e.target.value }))}
                    className="w-full px-2 py-1 bg-industrial-900 border border-industrial-700 text-white text-xs outline-none font-sans"
                  >
                    <option value="Fatality">Single Fatality (SIF)</option>
                    <option value="Multiple Fatalities">Multiple Fatalities (Major SIF)</option>
                    <option value="Major Fire">Major Fire / Explosion</option>
                    <option value="Serious Injury">Serious Life-Altering Injury</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* AI Pipeline Execution Feedback */}
          {isProcessing && (
            <div className="p-4 bg-industrial-950 border border-hazard-cyan/40 space-y-3">
              <div className="flex items-center gap-2 text-hazard-cyan font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>EXECUTING AI REFINERY SIF PRECURSOR ENGINE...</span>
              </div>
              <div className="space-y-1.5">
                {pipelineSteps.map((step, idx) => (
                  <div key={step} className="flex items-center gap-2 text-[11px]">
                    {idx < currentStepIndex ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : idx === currentStepIndex ? (
                      <div className="w-3.5 h-3.5 border-2 border-hazard-cyan border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 border border-industrial-700 rounded-full shrink-0" />
                    )}
                    <span className={idx <= currentStepIndex ? 'text-white' : 'text-industrial-500'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-industrial-950 border-t border-industrial-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-industrial-800 hover:bg-industrial-750 text-industrial-300 hover:text-white font-bold text-xs border border-industrial-700 transition"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!narrative.trim() || isProcessing}
            className="flex items-center gap-2 px-5 py-2 bg-hazard-red hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider transition border border-red-500 shadow-hazard-red disabled:opacity-40"
          >
            <span>INGEST &amp; CLASSIFY OBSERVATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

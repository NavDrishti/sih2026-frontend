export type RefineryUnit = 
  | 'DHT' 
  | 'FCC' 
  | 'SRU' 
  | 'CDU' 
  | 'Tank Farm' 
  | 'Hydrocracker' 
  | 'VDU' 
  | 'NHT';

export type ActivityType = 
  | 'Line Breaking' 
  | 'Maintenance' 
  | 'Hot Work' 
  | 'Confined Space Entry' 
  | 'Startup' 
  | 'Shutdown' 
  | 'Lifting' 
  | 'Routine Operations'
  | 'Working at Height';

export type ReportType = 'UA' | 'UC' | 'Near Miss' | 'Incident' | 'SIF Precursor';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MONITORED' | 'CLOSED';

export type BarrierStatus = 'FAILED' | 'NOT_VERIFIED' | 'WARNING' | 'VERIFIED';

export type IOGPRule = 
  | 'Energy Isolation'
  | 'Line of Fire'
  | 'Confined Space'
  | 'Hot Work'
  | 'Working at Height'
  | 'Driving'
  | 'Lifting Operations'
  | 'Bypassing Safety Controls'
  | 'Excavation'
  | 'Safe Mechanical Lifting / Suspended Loads';

export interface CriticalBarrier {
  name: string;
  expected: string;
  observed: string;
  status: BarrierStatus;
  controlType?: 'Engineering' | 'Administrative' | 'Procedural' | 'PPE';
}

export interface CausalStage {
  step: string; // e.g. "01"
  name: string; // e.g. "HAZARD PRESENT"
  description: string; // e.g. "Hot pressurized gasoil in P-204 suction line"
  isCritical: boolean;
  barrierImpact?: string;
}

export interface SIFParameterBreakdown {
  energyReleasePotential: number; // 1-5
  barrierFailure: number; // 1-5
  workerExposure: number; // 1-5
  hazardousMaterial: number; // 1-5
  lineBreaking: number; // 1-5
  controlVerification: number; // 1-5
  proximityToHazard: number; // 1-5
}

export interface CorrectiveAction {
  action_id: string;
  report_id: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  unit: RefineryUnit;
  due_date: string;
  status: 'OPEN' | 'IN PROGRESS' | 'AWAITING VERIFICATION' | 'CLOSED' | 'OVERDUE';
  notes?: string;
}

export interface SafetyReport {
  report_id: string;
  timestamp: string; // ISO or UTC string
  unit: RefineryUnit;
  equipment: string; // e.g. "P-204"
  equipment_full?: string; // e.g. "FEED PUMP P-204 SUCTION SPOOL"
  activity: ActivityType;
  report_type: ReportType;
  report_types: ReportType[]; // multiple classifications supported
  raw_narrative: string;
  ai_summary: string;
  confidence: number; // e.g. 94 (0-100)
  hazards: string[];
  barriers: CriticalBarrier[];
  iogp_rule: IOGPRule;
  sif_potential: boolean;
  sif_score: number; // e.g. 4.7 (0-5)
  sif_classification: 'IMMINENT SIF POTENTIAL' | 'HIGH SIF POTENTIAL' | 'ELEVATED RISK' | 'CONTROLLED';
  severity: SeverityLevel;
  p2h_rating?: string; // e.g. "P2H 5/5"
  critical_control_failure?: string;
  causal_pathway: CausalStage[];
  sif_parameters: SIFParameterBreakdown;
  why_flagged: string[];
  primary_escalation_trigger: string;
  reporter_role?: string;
  corrective_actions: CorrectiveAction[];
  photo_url?: string;
}

export interface UnitRiskSummary {
  unit: RefineryUnit;
  observations: number;
  sif_precursors: number;
  critical_failures: number;
  open_actions: number;
  dominant_hazard: string;
  risk_score: number; // 1-100 or 1-5
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface HeatmapCell {
  unit: RefineryUnit;
  activity: ActivityType;
  score: 1 | 2 | 3 | 4 | 5; // 1=low, 2=moderate, 3=elevated, 4=high, 5=critical
  observation_count: number;
  sif_precursor_count: number;
  top_failed_barrier: string;
  common_iogp_rule: IOGPRule;
}

export interface LifeSavingRuleSummary {
  rule: IOGPRule;
  flagged_count: number;
  percentage: number;
  trend: string; // e.g. "+12% vs last mo"
  top_unit: RefineryUnit;
  primary_failure: string;
}

export interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'HIGH' | 'ACTION DUE' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  report_id?: string;
  action_id?: string;
}

export interface GlobalFilterState {
  searchQuery: string;
  unit: RefineryUnit | 'ALL';
  activity: ActivityType | 'ALL';
  severity: SeverityLevel | 'ALL';
  sifOnly: boolean;
  iogpRule: IOGPRule | 'ALL';
  dateRange: '7D' | '30D' | '90D' | '6M' | '1Y';
}

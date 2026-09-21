export type UserRole = 'field_worker' | 'safety_inspector';

export interface UserProfile {
  id: string;
  badge_id: string;
  name: string;
  role: UserRole;
  title: string;
  unit: string;
  email: string;
}

export type RefineryUnit = 
  | 'DHT' 
  | 'FCC' 
  | 'SRU' 
  | 'CDU' 
  | 'Tank Farm' 
  | 'Hydrocracker' 
  | 'VDU' 
  | 'NHT'
  | 'Reformer'
  | 'Coker'
  | 'Utilities'
  | 'Pipeline Station 7'
  | (string & {});

export type ActivityType = 
  | 'Line Breaking' 
  | 'Maintenance' 
  | 'Hot Work' 
  | 'Confined Space Entry' 
  | 'Startup' 
  | 'Shutdown' 
  | 'Lifting' 
  | 'Routine Operations'
  | 'Working at Height'
  | 'Equipment Isolation'
  | 'Sampling / Chemical Handling'
  | 'Depressurization / Purging'
  | 'Driving'
  | (string & {});

export type ReportType = 'UA' | 'UC' | 'Near Miss' | 'Incident' | 'SIF Precursor';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MONITORED' | 'CLOSED';

export type BarrierStatus = 'Effective' | 'Degraded' | 'Failed' | 'Missing' | 'Bypassed' | 'Not Verified' | 'Unknown';

export type IOGPRule = 
  | 'Bypassing Safety Controls'
  | 'Confined Space'
  | 'Driving'
  | 'Energy Isolation'
  | 'Hot Work'
  | 'Line of Fire'
  | 'Safe Mechanical Lifting'
  | 'Work Authorisation'
  | 'Working at Height'
  | 'Lifting Operations'
  | 'Excavation'
  | 'Safe Mechanical Lifting / Suspended Loads';

// =========================================================================
// 10 REFINERY OBSERVATION PARAMETERS (FROM SIH REFINERY SPECIFICATION)
// =========================================================================

export interface Refinery10Parameters {
  // 01. Refinery Unit & Location
  refinery_unit?: string;
  process_area?: string;
  equipment?: string;
  specific_location?: string;

  // 02. Refinery Activity / Task
  activity_type?: string;
  task?: string;
  operating_condition?: 'Normal Operation' | 'Startup' | 'Shutdown' | 'Maintenance' | 'Emergency' | 'Abnormal Operation';
  routine_status?: 'Routine' | 'Non-routine';
  safety_critical_task?: boolean;

  // 03. UA/UC Observation Category
  ua_uc_type?: 'Unsafe Act (UA)' | 'Unsafe Condition (UC)';
  ua_uc_category?: string;
  ua_uc_subcategory?: string;

  // 04. Refinery Process Hazard & Mechanism
  process_hazard?: string;
  hazard_mechanism?: string;

  // 05. Hydrocarbon / Hazardous Energy & Exposure
  process_material?: string;
  energy_source?: 'Pressure' | 'Thermal' | 'Chemical' | 'Electrical' | 'Mechanical' | 'Stored Energy';
  pressure_condition?: 'Atmospheric' | 'Low Pressure (<2 bar)' | 'High Pressure (2–50 bar)' | 'Extreme Pressure (>50 bar)' | 'Vacuum' | 'Pressure Present';
  temperature_condition?: 'Ambient' | 'Cold/Cryogenic' | 'Elevated (>60°C)' | 'High Temperature (>150°C)' | 'Auto-ignition Range';
  persons_exposed?: number;
  exposure_type?: string;
  exposure_duration?: '<1 minute' | '1–5 minutes' | '5–30 minutes' | '30 minutes–2 hours' | '>2 hours';

  // 06. Process Safety Barrier / Critical Control
  barrier_type?: string;
  barrier_status?: BarrierStatus;
  critical_control_failure?: boolean;

  // 07. Operating / Human Factors
  performance_influencing_factor?: string;
  communication_issue?: boolean;
  supervision_issue?: boolean;

  // 08. Actual & Potential Consequence
  actual_consequence?: string;
  potential_consequence?: string;

  // 09. SIF / High-Potential Mechanism
  high_potential_event?: boolean;
  sif_potential?: boolean;
  sif_mechanism?: string;
  proximity_to_harm?: number; // 1 to 5
  fatality_pathway?: string;

  // 10. Immediate Action & Observation Status
  immediate_action?: string;
  work_stopped?: boolean;
  equipment_isolated?: boolean;
  supervisor_notified?: boolean;
  corrective_action?: string;
  observation_status?: 'Open' | 'Under Investigation' | 'Corrective Action Assigned' | 'Closed' | 'Verified Closed';
}

export interface CriticalBarrier {
  name: string;
  expected: string;
  observed: string;
  status: 'FAILED' | 'NOT_VERIFIED' | 'WARNING' | 'VERIFIED';
  controlType?: 'Engineering' | 'Administrative' | 'Procedural' | 'PPE';
}

export interface CausalStage {
  step: string;
  name: string;
  description: string;
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

export interface ReportChatMessage {
  id: string;
  report_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'field_worker' | 'safety_inspector' | 'ai_copilot';
  message: string;
  timestamp: string;
  is_ai: boolean;
  auto_updated_fields?: Record<string, any> | null;
}

export interface SafetyReport {
  report_id: string;
  timestamp: string;
  unit: RefineryUnit;
  equipment: string;
  equipment_full?: string;
  activity: ActivityType;
  report_type: ReportType;
  report_types: ReportType[];
  raw_narrative: string;
  ai_summary: string;
  confidence: number;
  hazards: string[];
  barriers: CriticalBarrier[];
  iogp_rule: IOGPRule;
  sif_potential: boolean;
  sif_score: number;
  sif_classification: 'IMMINENT SIF POTENTIAL' | 'HIGH SIF POTENTIAL' | 'ELEVATED RISK' | 'CONTROLLED';
  severity: SeverityLevel;
  p2h_rating?: string;
  critical_control_failure?: string;
  causal_pathway: CausalStage[];
  sif_parameters: SIFParameterBreakdown;
  why_flagged: string[];
  primary_escalation_trigger: string;
  reporter_role?: string;
  corrective_actions: CorrectiveAction[];
  photo_url?: string;
  status?: string;
  created_by?: string;
  created_by_name?: string;
  parameters?: Refinery10Parameters;
  site?: string;
  actual_outcome?: string;
  potential_outcome?: string;
  potential_consequence?: string;
  precursor_tags?: string[];
  review_status?: 'Confirmed' | 'Needs Investigation' | 'Escalated' | 'Under Review';
}

export interface UnitRiskSummary {
  unit: RefineryUnit;
  observations: number;
  sif_precursors: number;
  critical_failures: number;
  open_actions: number;
  dominant_hazard: string;
  risk_score: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface HeatmapCell {
  unit: RefineryUnit;
  activity: ActivityType;
  score: 1 | 2 | 3 | 4 | 5;
  observation_count: number;
  sif_precursor_count: number;
  top_failed_barrier: string;
  common_iogp_rule: IOGPRule;
}

export interface LifeSavingRuleSummary {
  rule: IOGPRule;
  flagged_count: number;
  percentage: number;
  trend: string;
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

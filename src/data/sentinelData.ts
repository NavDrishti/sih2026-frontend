import { SafetyReport, IOGPRule } from '../types/safety';

export interface SentinelObservation extends SafetyReport {
  site: string;
  actual_outcome: string;
  potential_outcome: string;
  precursor_tags: string[];
  review_status: 'Confirmed' | 'Needs Investigation' | 'Escalated' | 'Under Review';
}

export const DEMO_SITES = [
  'Refinery Unit 3',
  'North Gas Plant',
  'Crude Terminal',
  'Pipeline Station 7',
  'South Tank Farm',
  'Offshore Platform Alpha'
] as const;

export const IOGP_LIFE_SAVING_RULES_9: {
  id: string;
  name: IOGPRule;
  icon: string;
  description: string;
  color: string;
  exposures: number;
  sifPotentialCount: number;
}[] = [
  {
    id: 'energy-isolation',
    name: 'Energy Isolation',
    icon: 'Zap',
    description: 'Isolating energy sources before starting work',
    color: '#f59e0b',
    exposures: 4,
    sifPotentialCount: 4
  },
  {
    id: 'safe-mechanical-lifting',
    name: 'Safe Mechanical Lifting',
    icon: 'Box',
    description: 'Operating lifting equipment and managing exclusion zones',
    color: '#ef4444',
    exposures: 3,
    sifPotentialCount: 3
  },
  {
    id: 'hot-work',
    name: 'Hot Work',
    icon: 'Flame',
    description: 'Managing hot work and potential ignition sources in hazardous areas',
    color: '#ef4444',
    exposures: 3,
    sifPotentialCount: 3
  },
  {
    id: 'working-at-height',
    name: 'Working at Height',
    icon: 'TrendingUp',
    description: 'Protecting against falls from elevated work positions',
    color: '#3b82f6',
    exposures: 3,
    sifPotentialCount: 3
  },
  {
    id: 'bypassing-safety-controls',
    name: 'Bypassing Safety Controls',
    icon: 'Slash',
    description: 'Bypassing or disabling safety critical controls and interlocks',
    color: '#ef4444',
    exposures: 3,
    sifPotentialCount: 3
  },
  {
    id: 'confined-space',
    name: 'Confined Space',
    icon: 'BoxSelect',
    description: 'Entering and working safely inside confined spaces',
    color: '#8b5cf6',
    exposures: 2,
    sifPotentialCount: 2
  },
  {
    id: 'line-of-fire',
    name: 'Line of Fire',
    icon: 'Crosshair',
    description: 'Positioning bodies and equipment outside path of stored energy',
    color: '#ec4899',
    exposures: 2,
    sifPotentialCount: 2
  },
  {
    id: 'work-authorisation',
    name: 'Work Authorisation',
    icon: 'FileCheck',
    description: 'Validating work permits and safety requirements before work starts',
    color: '#06b6d4',
    exposures: 2,
    sifPotentialCount: 1
  },
  {
    id: 'driving',
    name: 'Driving',
    icon: 'Car',
    description: 'Operating light vehicles and heavy plant safely on worksites',
    color: '#3b82f6',
    exposures: 1,
    sifPotentialCount: 1
  }
];

export const PRECURSOR_PATTERNS = [
  {
    id: 'prec-01',
    title: 'Workers entering lifting exclusion zones',
    description: 'Personnel walking through barricaded lifting zones during active crane lifts. Pattern concentrated at Refinery Unit 3 flare and gas plant areas.',
    occurrences: 6,
    sitesCount: 2,
    relatedRule: 'Safe Mechanical Lifting' as IOGPRule,
    trend: 'Rising' as const,
    severity: 'Critical' as const,
    sampleObservationIds: ['OBS-2026-0141', 'OBS-2026-0136', 'OBS-2026-0129']
  },
  {
    id: 'prec-02',
    title: 'Permit-to-work gaps',
    description: 'Expired permits, permits not available at worksite, and work continuing without valid authorisation. Most frequent precursor pattern across all operational sites.',
    occurrences: 11,
    sitesCount: 4,
    relatedRule: 'Work Authorisation' as IOGPRule,
    trend: 'Rising' as const,
    severity: 'High' as const,
    sampleObservationIds: ['OBS-2026-0137', 'OBS-2026-0134', 'OBS-2026-0127']
  },
  {
    id: 'prec-03',
    title: 'Line-of-fire exposure',
    description: 'Workers positioning themselves in line of fire during pressure testing operations, high-torque tensioning, and suspended load paths. Includes dropped object exposure.',
    occurrences: 7,
    sitesCount: 3,
    relatedRule: 'Line of Fire' as IOGPRule,
    trend: 'Stable' as const,
    severity: 'High' as const,
    sampleObservationIds: ['OBS-2026-0135', 'OBS-2026-0130', 'OBS-2026-0124']
  },
  {
    id: 'prec-04',
    title: 'Contractor-related recurring risks',
    description: 'Recurring safety violations concentrated among turnaround contractors. Saipem and Larsen & Toubro account for 60% of SIF-potential contractor events.',
    occurrences: 9,
    sitesCount: 3,
    relatedRule: 'Bypassing Safety Controls' as IOGPRule,
    trend: 'Rising' as const,
    severity: 'High' as const,
    sampleObservationIds: ['OBS-2026-0140', 'OBS-2026-0132', 'OBS-2026-0126']
  },
  {
    id: 'prec-05',
    title: 'Bypassing safety controls',
    description: 'Interlock bypass without MOC approval, gas detection alarm ignored, and non-rated equipment introduced into hazardous zones. High SIF potential with 3 critical events.',
    occurrences: 5,
    sitesCount: 3,
    relatedRule: 'Bypassing Safety Controls' as IOGPRule,
    trend: 'Stable' as const,
    severity: 'Critical' as const,
    sampleObservationIds: ['OBS-2026-0132', 'OBS-2026-0126', 'OBS-2026-0125']
  },
  {
    id: 'prec-06',
    title: 'Missing isolation verification',
    description: 'Failure to perform physical zero-energy bleed checks before line breaking or electrical work. High probability of pressurized hydrocarbon or electrocution release.',
    occurrences: 4,
    sitesCount: 2,
    relatedRule: 'Energy Isolation' as IOGPRule,
    trend: 'Rising' as const,
    severity: 'Critical' as const,
    sampleObservationIds: ['OBS-2026-0142', 'OBS-2026-0133', 'OBS-2026-0128']
  }
];

export const SENTINEL_OBSERVATIONS: SentinelObservation[] = [
  {
    report_id: 'OBS-2026-0142',
    timestamp: '2026-09-20T14:32:00Z',
    unit: 'DHT',
    site: 'Refinery Unit 3',
    equipment: 'P-301 A/B',
    equipment_full: 'High Pressure Feed Pump P-301 Suction Spool',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UC'],
    raw_narrative: 'During maintenance on pump P-301 in Refinery Unit 3, the lockout-tagout was not verified before the technician started unbolting the companion flange. The isolation permit was signed off, but nobody physically opened the bleed valve to confirm zero pressure. Warm gasoil seeped as the first two bolts were cracked.',
    ai_summary: 'LOTO zero-energy verification was omitted prior to opening hydrocarbon flange on pump P-301. Line remained under 8 bar residual head.',
    confidence: 96,
    hazards: ['Pressurized Hydrocarbon', 'Toxic H2S Vapor', 'Hot Liquid (110°C)'],
    barriers: [
      { name: 'Double Block & Bleed', expected: 'Required', observed: 'Single valve isolated; bleed valve plugged', status: 'FAILED', controlType: 'Engineering' },
      { name: 'Zero Energy Verification', expected: 'Required', observed: 'Omitted before flange unbolting', status: 'FAILED', controlType: 'Procedural' },
      { name: 'Permit-to-Work', expected: 'Required', observed: 'Signed off without field verification', status: 'NOT_VERIFIED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 87,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (No Injury)',
    potential_consequence: 'Fatal Injury / High Pressure Spray Fire',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Missing isolation verification', 'Contractor oversight', 'Permit gap'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [
      { step: '1', name: 'Permit Signoff', description: 'Permit signed remotely without field walkdown', isCritical: true },
      { step: '2', name: 'Flange Unbolting', description: 'Technician opened studs without bleed proof', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 5,
      controlVerification: 5,
      proximityToHazard: 4
    },
    why_flagged: ['Hydrocarbon line break without positive isolation verification', 'Worker in direct spray arc'],
    primary_escalation_trigger: 'High SIF Potential on Hydrocarbon Isolation Barrier Failure',
    corrective_actions: [
      { action_id: 'ACT-0142-1', report_id: 'OBS-2026-0142', description: 'Mandatory two-person zero energy verification signoff before stud loosening', priority: 'CRITICAL', owner: 'R. Sharma (HSE)', unit: 'DHT', due_date: '2026-09-22', status: 'OPEN' }
    ]
  },
  {
    report_id: 'OBS-2026-0141',
    timestamp: '2026-09-20T11:15:00Z',
    unit: 'FCC',
    site: 'Refinery Unit 3',
    equipment: 'CR-02',
    equipment_full: 'Demag 120T Mobile Crane at Flare Perimeter',
    activity: 'Lifting',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UA'],
    raw_narrative: 'A crane was lifting a 2-tonne pipe section near the flare stack when two contract workers walked straight through the barricaded lifting zone under the suspended load. The rigger shouted and sounded air horn to stop the lift. Load swung within 1.5 meters of workers.',
    ai_summary: 'Personnel breached hard barricades into the drop zone during a 2-tonne suspended load maneuver.',
    confidence: 94,
    hazards: ['Suspended Load Drop (2000 kg)', 'Crush Hazard', 'Restricted Egress'],
    barriers: [
      { name: 'Exclusion Zone Barricade', expected: 'Required', observed: 'Barricade tape breached by workers', status: 'FAILED', controlType: 'Administrative' },
      { name: 'Slinger / Banksman Control', expected: 'Required', observed: 'Stopped lift using emergency horn', status: 'VERIFIED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Safe Mechanical Lifting',
    sif_potential: true,
    sif_score: 91,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (No Injury)',
    potential_consequence: 'Fatal Crush Injury by Dropped 2-tonne Spool',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Workers entering lifting exclusion zones', 'Contractor-related recurring risks'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [
      { step: '1', name: 'Zone Incursion', description: 'Workers took shortcut through red perimeter tape', isCritical: true },
      { step: '2', name: 'Emergency Stop', description: 'Rigger halted swing before impact occurred', isCritical: false }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 4,
      workerExposure: 5,
      hazardousMaterial: 2,
      lineBreaking: 1,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: ['Personnel directly under suspended load', 'Exclusion zone boundary violated during live crane travel'],
    primary_escalation_trigger: 'Critical Dropped Load Exposure with Imminent Fatality Potential',
    corrective_actions: [
      { action_id: 'ACT-0141-1', report_id: 'OBS-2026-0141', description: 'Install rigid steel barriers for all lifts exceeding 1 tonne along transit alleys', priority: 'CRITICAL', owner: 'M. Al-Husseini', unit: 'FCC', due_date: '2026-09-23', status: 'IN PROGRESS' }
    ]
  },
  {
    report_id: 'OBS-2026-0140',
    timestamp: '2026-09-19T16:40:00Z',
    unit: 'SRU',
    site: 'North Gas Plant',
    equipment: 'H-104',
    equipment_full: 'Acid Gas Flare Header Tie-In Spool',
    activity: 'Hot Work',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UA'],
    raw_narrative: 'At North Gas Plant, a contractor was doing welding on a structural gusset plate only 40 cm away from a hydrocarbon line that had not been fully drained or certified zero LEL. The hot work permit had expired 45 minutes prior and the continuous gas detector had run out of battery.',
    ai_summary: 'Hot work torch actively operating near unpurged flammable gas line with expired permit and non-functioning continuous gas monitor.',
    confidence: 98,
    hazards: ['Vapor Cloud Explosion (VCE)', 'Flash Fire', 'Toxic Sour Gas (H2S)'],
    barriers: [
      { name: 'Continuous Gas Detection', expected: 'Required', observed: 'Monitor battery depleted, no audible alert', status: 'FAILED', controlType: 'Engineering' },
      { name: 'Hot Work Permit Validity', expected: 'Required', observed: 'Permit expired 45 minutes earlier', status: 'FAILED', controlType: 'Administrative' },
      { name: 'Fire Watch', expected: 'Required', observed: 'Fire watch was absent from immediate worksite', status: 'FAILED', controlType: 'Procedural' }
    ],
    iogp_rule: 'Hot Work',
    sif_potential: true,
    sif_score: 95,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Work Halted by Auditor)',
    potential_consequence: 'Multiple Fatalities / Catastrophic Plant Flash Fire',
    potential_outcome: 'Multiple Fatalities',
    precursor_tags: ['Permit-to-work gaps', 'Bypassing safety controls', 'Contractor-related recurring risks'],
    review_status: 'Needs Investigation',
    status: 'Needs Investigation',
    causal_pathway: [
      { step: '1', name: 'Permit Expiry', description: 'Contractor continued grinding & welding past permit duration', isCritical: true },
      { step: '2', name: 'Gas Monitor Depletion', description: 'LEL detector went silent unnoticed', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 5,
      lineBreaking: 3,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: ['Open ignition source within flammable atmosphere envelope', 'Multiple barrier failure stack'],
    primary_escalation_trigger: 'Multiple Barrier Failure with Catastrophic Explosion Exposure',
    corrective_actions: [
      { action_id: 'ACT-0140-1', report_id: 'OBS-2026-0140', description: 'Stand down North Gas Plant hot work and re-audit gas monitoring protocols', priority: 'CRITICAL', owner: 'A. Campbell', unit: 'SRU', due_date: '2026-09-21', status: 'OPEN' }
    ]
  },
  {
    report_id: 'OBS-2026-0139',
    timestamp: '2026-09-19T14:20:00Z',
    unit: 'Tank Farm',
    site: 'South Tank Farm',
    equipment: 'TK-402',
    equipment_full: 'Crude Storage Tank TK-402 Floating Roof Stairway',
    activity: 'Working at Height',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UA'],
    raw_narrative: 'Contractor painter working on outer shell scaffold at 14 meters elevation was seen unhooking both shock-absorbing lanyards to walk around a scaffold upright. For approximately 45 seconds, the technician was entirely untethered with an open 14-meter drop onto asphalt below.',
    ai_summary: '100% tie-off protocol violated at 14m elevation during scaffold repositioning.',
    confidence: 93,
    hazards: ['Fall from Height (14m)', 'Dropped Hand Tools', 'Scaffold Edge Exposure'],
    barriers: [
      { name: '100% Dual Lanyard Tie-Off', expected: 'Required', observed: 'Both hooks disconnected simultaneously', status: 'FAILED', controlType: 'Procedural' },
      { name: 'Full Body Harness', expected: 'Required', observed: 'Harness worn correctly but unanchored', status: 'WARNING', controlType: 'PPE' }
    ],
    iogp_rule: 'Working at Height',
    sif_potential: true,
    sif_score: 89,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'No Injury (Worker Re-hooked After Callout)',
    potential_consequence: 'Fatal Impact from 14-meter Fall',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Contractor-related recurring risks', 'Working at height non-compliance'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [
      { step: '1', name: 'Transit Across Upright', description: 'Worker detached second lanyard before clipping first', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 4,
      workerExposure: 5,
      hazardousMaterial: 1,
      lineBreaking: 1,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: ['Fall potential > 10m without secondary fall arrest anchor'],
    primary_escalation_trigger: 'High SIF Fall-from-Height Exposure',
    corrective_actions: [
      { action_id: 'ACT-0139-1', report_id: 'OBS-2026-0139', description: 'Install continuous horizontal lifeline wire on tank perimeter scaffold', priority: 'HIGH', owner: 'K. Patel', unit: 'Tank Farm', due_date: '2026-09-24', status: 'OPEN' }
    ]
  },
  {
    report_id: 'OBS-2026-0138',
    timestamp: '2026-09-19T10:05:00Z',
    unit: 'CDU',
    site: 'Crude Terminal',
    equipment: 'SEP-101',
    equipment_full: 'Primary Crude Desalter Vessel Internal Manway',
    activity: 'Confined Space Entry',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UC'],
    raw_narrative: 'During pre-entry checks on Crude Desalter Vessel SEP-101, entry attendant logged oxygen at 20.8% at manway throat. However, probe had not been lowered to sludge layer where H2S sensor alarmed at 48 ppm. Two technicians were on the access ladder prepared to enter.',
    ai_summary: 'Confined space multi-level atmospheric testing incomplete; lethal H2S pocket detected at vessel floor.',
    confidence: 95,
    hazards: ['Deadly Toxic Gas (H2S 48 ppm)', 'Asphyxiation Hazard', 'Limited Escape Path'],
    barriers: [
      { name: 'Multi-Level Atmospheric Testing', expected: 'Required', observed: 'Bottom stratification check omitted initially', status: 'FAILED', controlType: 'Procedural' },
      { name: 'Trained Standby Watch', expected: 'Required', observed: 'Watch stopped entry when sensor triggered', status: 'VERIFIED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Confined Space',
    sif_potential: true,
    sif_score: 84,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (Entry Blocked at Manway)',
    potential_consequence: 'Fatal H2S Inhalation & Asphyxiation',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Permit-to-work gaps', 'Atmospheric test omission'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [
      { step: '1', name: 'Stratified Gas Incursion', description: 'Heavier-than-air sour vapor trapped beneath internal baffles', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 4,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 2,
      controlVerification: 4,
      proximityToHazard: 4
    },
    why_flagged: ['Lethal toxic concentration within confined space boundary'],
    primary_escalation_trigger: 'Toxic H2S Stratification in Enclosed Vessel',
    corrective_actions: [
      { action_id: 'ACT-0138-1', report_id: 'OBS-2026-0138', description: 'Recalibrate deep sampling probes and enforce mechanical forced air ventilation', priority: 'HIGH', owner: 'J. Dupont', unit: 'CDU', due_date: '2026-09-22', status: 'CLOSED' }
    ]
  },
  {
    report_id: 'OBS-2026-0137',
    timestamp: '2026-09-18T15:50:00Z',
    unit: 'Hydrocracker',
    site: 'Pipeline Station 7',
    equipment: 'V-201',
    equipment_full: 'High Pressure Separator Boot Drain Valve',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UC'],
    raw_narrative: 'Maintenance crew was preparing to change gland packing on 600# drain valve. The permit listed unit depressurized to 0 psi, but analog pressure gauge needle was stuck on zero stop pin. Field supervisor tapped glass and needle jumped to 14 bar.',
    ai_summary: 'False zero pressure reading due to damaged gauge needle; line contained 14 bar gas.',
    confidence: 97,
    hazards: ['Stored Pressure (14 bar)', 'Flammable Condensate Release'],
    barriers: [
      { name: 'Redundant Gauge / Bleed Check', expected: 'Required', observed: 'Single stuck gauge relied upon initially', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 82,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (Pressure Discovered Before Break)',
    potential_consequence: 'High Velocity Projectile / Worker Impact',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Missing isolation verification', 'Permit-to-work gaps'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [
      { step: '1', name: 'Defective Instrumentation', description: 'Analog gauge mechanical failure concealed line pressure', isCritical: true }
    ],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 4, workerExposure: 4, hazardousMaterial: 4, lineBreaking: 4, controlVerification: 4, proximityToHazard: 4 },
    why_flagged: ['Pressure line breaking with unverified isolation'],
    primary_escalation_trigger: 'Hidden Stored Mechanical Pressure',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0136',
    timestamp: '2026-09-18T09:10:00Z',
    unit: 'VDU',
    site: 'Offshore Platform Alpha',
    equipment: 'PED-CR-1',
    equipment_full: 'Main Deck Pedestal Crane 45T',
    activity: 'Lifting',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'UA'],
    raw_narrative: 'Offloading drill collar basket from supply vessel in 2.2m swell. Tagline became caught around deck cleat, causing load to yaw violently toward personnel accommodation bulkhead. Slinger jumped back to avoid being pinned.',
    ai_summary: 'Tagline snag during dynamic offshore lift caused uncontrolled load swing.',
    confidence: 91,
    hazards: ['Crush Hazard against Bulkhead', 'Tagline Tension Snapping'],
    barriers: [
      { name: 'Tagline Management Protocol', expected: 'Required', observed: 'Excess slack caught on fixed cleat', status: 'FAILED', controlType: 'Procedural' }
    ],
    iogp_rule: 'Safe Mechanical Lifting',
    sif_potential: true,
    sif_score: 79,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (No Injury)',
    potential_consequence: 'Crush Fatality / Structural Impact',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Line-of-fire exposure', 'Dynamic marine operations'],
    review_status: 'Under Review',
    status: 'Under Review',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 3, workerExposure: 4, hazardousMaterial: 1, lineBreaking: 1, controlVerification: 3, proximityToHazard: 4 },
    why_flagged: ['Severe load oscillation toward escape route'],
    primary_escalation_trigger: 'Offshore Dynamic Lift Oscillation',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0135',
    timestamp: '2026-09-17T17:00:00Z',
    unit: 'SRU',
    site: 'Pipeline Station 7',
    equipment: 'FL-09',
    equipment_full: '24-Inch High Pressure Pipeline Launcher Flange',
    activity: 'Routine Operations',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Operator standing directly in front of pig launcher barrel door while hydraulic closure mechanism was under pressure testing at 85 bar. Safety latch was not engaged.',
    ai_summary: 'Operator in line of fire directly facing 85-bar pressurized pig barrel end closure.',
    confidence: 96,
    hazards: ['Extreme Pressure (85 bar)', 'High Velocity Barrel Projectile'],
    barriers: [
      { name: 'Line-of-Fire Standing Position', expected: 'Required', observed: 'Operator standing in axis of projectile path', status: 'FAILED', controlType: 'Procedural' },
      { name: 'Mechanical Safety Interlock', expected: 'Required', observed: 'Secondary dog latch disengaged', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Line of Fire',
    sif_potential: true,
    sif_score: 92,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Interrupted by Station Lead)',
    potential_consequence: 'Fatal Impact / Catastrophic Gas Release',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Line-of-fire exposure', 'Bypassing safety controls'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 5, barrierFailure: 4, workerExposure: 5, hazardousMaterial: 4, lineBreaking: 3, controlVerification: 4, proximityToHazard: 5 },
    why_flagged: ['Positioning directly in line of fire of 85-bar closure'],
    primary_escalation_trigger: 'Direct Line of Fire under Extreme Hydraulic Testing',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0134',
    timestamp: '2026-09-17T11:45:00Z',
    unit: 'Utilities',
    site: 'North Gas Plant',
    equipment: 'BLR-02',
    equipment_full: 'Steam Boiler High Pressure Blowdown Line',
    activity: 'Hot Work',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Contractor welding support brackets on live high pressure steam line without approved hot-tap engineered procedure or infrared thermal baseline scan.',
    ai_summary: 'Hot work welding performed directly on pressurized 42-bar steam pipe without specialized engineering authorization.',
    confidence: 90,
    hazards: ['Superheated Steam (42 bar, 260°C)', 'Thermal Burn / Pipe Burn-through'],
    barriers: [
      { name: 'Management of Change (MOC)', expected: 'Required', observed: 'MOC not raised for live line welding', status: 'FAILED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Hot Work',
    sif_potential: true,
    sif_score: 85,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Work Stopped)',
    potential_consequence: 'Fatal Scalding / Superheated Steam Rupture',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Permit-to-work gaps', 'Contractor-related recurring risks'],
    review_status: 'Needs Investigation',
    status: 'Needs Investigation',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 5, barrierFailure: 4, workerExposure: 4, hazardousMaterial: 3, lineBreaking: 2, controlVerification: 4, proximityToHazard: 4 },
    why_flagged: ['Uncontrolled thermal heating of pressurized steam containment'],
    primary_escalation_trigger: 'Hot Work on Live Superheated System',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0133',
    timestamp: '2026-09-16T14:15:00Z',
    unit: 'CDU',
    site: 'Crude Terminal',
    equipment: 'MOV-104',
    equipment_full: 'Main Crude Transfer Header Motor Operated Valve',
    activity: 'Equipment Isolation',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Electrician isolated circuit breaker 480V for valve actuator MOV-104, but failed to verify secondary 120V UPS control signal supply. When technician touched actuator terminals, a 120V arc flash occurred.',
    ai_summary: 'Incomplete electrical isolation left 120V control circuitry live during actuator servicing.',
    confidence: 95,
    hazards: ['Electrical Arc Flash', 'Electrocution Hazard (120V UPS)'],
    barriers: [
      { name: 'Comprehensive Electrical Isolation', expected: 'Required', observed: 'Auxiliary UPS circuit omitted from LOTO schematic', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 86,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'No Injury (Arc Flash Shield Triggered)',
    potential_consequence: 'Fatal Electrocution / Electrical Burn',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Missing isolation verification', 'Electrical safety gap'],
    review_status: 'Needs Investigation',
    status: 'Needs Investigation',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 4, workerExposure: 5, hazardousMaterial: 1, lineBreaking: 1, controlVerification: 5, proximityToHazard: 5 },
    why_flagged: ['Live electrical circuit contact under assumed dead condition'],
    primary_escalation_trigger: 'Auxiliary Power Source Isolation Omission',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0132',
    timestamp: '2026-09-16T08:30:00Z',
    unit: 'Tank Farm',
    site: 'South Tank Farm',
    equipment: 'TK-408',
    equipment_full: 'Slop Oil Tank TK-408 Sump Entry',
    activity: 'Confined Space Entry',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Contractor entered slop oil sump without safety harness or tripod rescue winch system rigged at surface. Sump contained 30cm viscous oily emulsion.',
    ai_summary: 'Confined space entry conducted without emergency extraction winch or rescue rigging.',
    confidence: 94,
    hazards: ['Submerged Entrapment', 'Toxic Vapor Inhalation', 'Inability to Rescue'],
    barriers: [
      { name: 'Emergency Rescue Equipment', expected: 'Required', observed: 'Tripod and retrieval winch not deployed', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: true,
    sif_score: 93,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Workers Ordered Out by HSE Lead)',
    potential_consequence: 'Multiple Fatalities (Worker & Potential Rescuers)',
    potential_outcome: 'Multiple Fatalities',
    precursor_tags: ['Contractor-related recurring risks', 'Bypassing safety controls'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 5, workerExposure: 5, hazardousMaterial: 4, lineBreaking: 1, controlVerification: 4, proximityToHazard: 5 },
    why_flagged: ['Confined space entry without designated rescue capability'],
    primary_escalation_trigger: 'Total Absence of Confined Space Rescue Safeguards',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0131',
    timestamp: '2026-09-15T16:10:00Z',
    unit: 'DHT',
    site: 'Refinery Unit 3',
    equipment: 'TK-101',
    equipment_full: 'Chemical Dosing Area Forklift',
    activity: 'Driving',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'UA'],
    raw_narrative: 'Forklift operator transporting pallet of caustic chemical drums was observed driving at excessive speed through blind warehouse intersection without sounding horn.',
    ai_summary: 'Forklift speeding with hazardous chemical cargo through obstructed pedestrian walkway.',
    confidence: 88,
    hazards: ['Vehicle Collision', 'Chemical Drum Puncture & Spill'],
    barriers: [
      { name: 'Speed Limiter / Intersection Protocol', expected: 'Required', observed: 'Horn not sounded, speed exceeded 10 km/h limit', status: 'FAILED', controlType: 'Procedural' }
    ],
    iogp_rule: 'Driving',
    sif_potential: true,
    sif_score: 78,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (Pedestrian Stepped Back)',
    potential_consequence: 'Severe Crush / Pedestrian Fatality',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Driving violations', 'Blind corner traffic'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 3, barrierFailure: 3, workerExposure: 4, hazardousMaterial: 4, lineBreaking: 1, controlVerification: 3, proximityToHazard: 4 },
    why_flagged: ['Pedestrian impact risk in hazardous chemical transit zone'],
    primary_escalation_trigger: 'Plant Vehicle Pedestrian Collision Risk',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0130',
    timestamp: '2026-09-15T11:20:00Z',
    unit: 'FCC',
    site: 'North Gas Plant',
    equipment: 'HEX-204',
    equipment_full: 'High Pressure Exchanger Channel Head',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Fitter stood directly in front of hydraulic torque wrench reacting against channel head stud without secondary safety sling or reaction stop bar.',
    ai_summary: 'Worker in pinch point line of fire of 10,000 psi hydraulic torque tool reaction arm.',
    confidence: 92,
    hazards: ['Hydraulic Pressure (10,000 psi)', 'Pinch Point / Severe Amputation'],
    barriers: [
      { name: 'Tool Reaction Arm Restraint', expected: 'Required', observed: 'Safety tether omitted', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Line of Fire',
    sif_potential: true,
    sif_score: 83,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (Operator Stopped Tool)',
    potential_consequence: 'Limb Amputation / High Impact Trauma',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Line-of-fire exposure', 'Hydraulic tooling gap'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 4, workerExposure: 4, hazardousMaterial: 1, lineBreaking: 1, controlVerification: 4, proximityToHazard: 5 },
    why_flagged: ['Worker hand within catastrophic pinch zone'],
    primary_escalation_trigger: 'Hydraulic Torque Wrench Line of Fire',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0129',
    timestamp: '2026-09-14T15:00:00Z',
    unit: 'CDU',
    site: 'Refinery Unit 3',
    equipment: 'CR-04',
    equipment_full: 'Overhead Gantry Crane in Compressor House',
    activity: 'Lifting',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'UA'],
    raw_narrative: 'Technicians rigging 800kg compressor rotor using synthetic web slings that showed extensive chemical acid degradation and fraying along the edge stitching.',
    ai_summary: 'Damaged synthetic lifting sling utilized for heavy rotor lift without pre-use inspection.',
    confidence: 95,
    hazards: ['Dropped Load (800kg)', 'Equipment Damage to Critical Compressor'],
    barriers: [
      { name: 'Lifting Tackle Color Coding & Inspection', expected: 'Required', observed: 'Out-of-date color code and visible fiber cuts', status: 'FAILED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Safe Mechanical Lifting',
    sif_potential: true,
    sif_score: 88,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'Near Miss (Sling Replaced Before Lift)',
    potential_consequence: 'Fatal Impact from Dropped Rotor',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Workers entering lifting exclusion zones', 'Rigging equipment defects'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 4, workerExposure: 4, hazardousMaterial: 1, lineBreaking: 1, controlVerification: 4, proximityToHazard: 4 },
    why_flagged: ['Compromised rigging hardware in close proximity to crew'],
    primary_escalation_trigger: 'Defective Rigging Gear with Failure Potential',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0128',
    timestamp: '2026-09-14T10:15:00Z',
    unit: 'DHT',
    site: 'South Tank Farm',
    equipment: 'PSV-202',
    equipment_full: 'Pressure Safety Valve Isolation Car-Seal',
    activity: 'Routine Operations',
    report_type: 'UC',
    report_types: ['UC', 'SIF Precursor'],
    raw_narrative: 'During daily perimeter rounds, operator discovered car-seal on upstream isolation block valve for relief valve PSV-202 was cut and valve wheel was 3 turns in closed direction.',
    ai_summary: 'Relief valve inlet isolation valve partially closed with severed safety car-seal.',
    confidence: 97,
    hazards: ['Overpressure Catastrophe', 'Vessel Burst Hazard'],
    barriers: [
      { name: 'Car-Seal Integrity Program', expected: 'Required', observed: 'Seal severed without lock-open log entry', status: 'FAILED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: true,
    sif_score: 94,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Valve Re-opened & Re-sealed)',
    potential_consequence: 'Catastrophic Vessel Overpressure & Rupture',
    potential_outcome: 'Multiple Fatalities',
    precursor_tags: ['Bypassing safety controls', 'Relief system integrity'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 5, barrierFailure: 5, workerExposure: 4, hazardousMaterial: 5, lineBreaking: 1, controlVerification: 4, proximityToHazard: 4 },
    why_flagged: ['Pressure relief path compromised on live processing vessel'],
    primary_escalation_trigger: 'Critical Overpressure Barrier Defeat',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0127',
    timestamp: '2026-09-13T14:30:00Z',
    unit: 'SRU',
    site: 'Refinery Unit 3',
    equipment: 'T-102',
    equipment_full: 'Amine Contactor Tower Platform',
    activity: 'Working at Height',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Scaffold toe-board missing on platform 22 meters above grade. Technician kicked a heavy torque socket which rolled off and fell 22 meters, crashing into lower deck.',
    ai_summary: 'Dropped object from 22m elevation due to absent scaffolding toe-board.',
    confidence: 92,
    hazards: ['Dropped Object (22m Fall)', 'Kinetic Energy Impact (180 Joules)'],
    barriers: [
      { name: 'Scaffold Toe-boards & Mesh', expected: 'Required', observed: 'Toe-board removed and not reinstalled', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Working at Height',
    sif_potential: true,
    sif_score: 87,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    actual_outcome: 'No Injury (Object Struck Concrete Grade)',
    potential_consequence: 'Fatal Head Impact to Ground Personnel',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Permit-to-work gaps', 'Dropped object hazard'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 4, barrierFailure: 4, workerExposure: 4, hazardousMaterial: 1, lineBreaking: 1, controlVerification: 3, proximityToHazard: 4 },
    why_flagged: ['High velocity dropped object impacting occupied ground quadrant'],
    primary_escalation_trigger: 'High Elevation Dropped Object Threat',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0126',
    timestamp: '2026-09-13T09:40:00Z',
    unit: 'Pipeline Station 7',
    site: 'Pipeline Station 7',
    equipment: 'ESD-01',
    equipment_full: 'Station Emergency Shutdown Bypass Switch',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Technician left station ESD system in software bypass mode overnight following instrument calibration without notifying incoming night shift lead or recording in control log.',
    ai_summary: 'Safety Instrument Level (SIL-3) emergency shutdown switch left bypassed without handover documentation.',
    confidence: 98,
    hazards: ['Uncontrolled Loss of Containment', 'Failure of Automated Emergency Trip'],
    barriers: [
      { name: 'Bypass Management & Shift Handover', expected: 'Required', observed: 'Bypass active for 14 hours without authorization', status: 'FAILED', controlType: 'Administrative' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: true,
    sif_score: 92,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Identified during Audit)',
    potential_consequence: 'Catastrophic Pipeline Burst / Uncontrolled Fire',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Bypassing safety controls', 'Shift handover gaps'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 5, barrierFailure: 5, workerExposure: 4, hazardousMaterial: 5, lineBreaking: 1, controlVerification: 5, proximityToHazard: 4 },
    why_flagged: ['Automated safety interlock defeated without compensation'],
    primary_escalation_trigger: 'Safety Critical Trip Defeated Unannounced',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0125',
    timestamp: '2026-09-12T16:05:00Z',
    unit: 'CDU',
    site: 'Crude Terminal',
    equipment: 'P-101',
    equipment_full: 'Crude Charge Pump Mechanical Seal Flush Cooler',
    activity: 'Routine Operations',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Cooling water block valve on Plan 53A seal pot was found closed, causing seal barrier fluid to heat up to 140°C. Crude hydrocarbon vapors began venting from atmospheric degassing port.',
    ai_summary: 'Mechanical seal barrier fluid overheat due to blocked cooling water supply on crude pump.',
    confidence: 91,
    hazards: ['Mechanical Seal Catastrophic Failure', 'Hot Hydrocarbon Jet Fire'],
    barriers: [
      { name: 'Cooling Water Alignment Protocol', expected: 'Required', observed: 'Supply valve tagged closed in error', status: 'FAILED', controlType: 'Procedural' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: false,
    sif_score: 52,
    sif_classification: 'ELEVATED RISK',
    severity: 'ELEVATED',
    actual_outcome: 'Near Miss (Pump Swapped to Standby)',
    potential_consequence: 'Seal Face Rupture / Local Skid Fire',
    potential_outcome: 'Minor Equipment Damage',
    precursor_tags: ['Valve alignment errors'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 3, barrierFailure: 3, workerExposure: 2, hazardousMaterial: 3, lineBreaking: 1, controlVerification: 2, proximityToHazard: 2 },
    why_flagged: ['Seal overheating caught before loss of containment'],
    primary_escalation_trigger: 'Seal Flush Thermal Anomaly',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0124',
    timestamp: '2026-09-12T11:30:00Z',
    unit: 'DHT',
    site: 'Refinery Unit 3',
    equipment: 'CV-402',
    equipment_full: 'High Pressure Recycle Gas Flow Control Valve',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Fitter attempting to tighten packing nut on live 90-bar hydrogen recycle gas line while kneeling directly above valve bonnet stem.',
    ai_summary: 'Worker positioning upper torso directly over live 90-bar hydrogen valve stem while torquing gland bolts.',
    confidence: 96,
    hazards: ['High Pressure Hydrogen (90 bar)', 'Stem Blowout Projectile', 'Invisible Jet Fire'],
    barriers: [
      { name: 'Line of Fire Body Positioning', expected: 'Required', observed: 'Worker crouched directly in trajectory of valve stem', status: 'FAILED', controlType: 'Procedural' }
    ],
    iogp_rule: 'Line of Fire',
    sif_potential: true,
    sif_score: 90,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    actual_outcome: 'Near Miss (Job Interrupted)',
    potential_consequence: 'Fatal Stem Blowout Impact / Hydrogen Flash Fire',
    potential_outcome: 'Fatal Injury',
    precursor_tags: ['Line-of-fire exposure', 'High pressure gas risk'],
    review_status: 'Escalated',
    status: 'Escalated',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 5, barrierFailure: 4, workerExposure: 5, hazardousMaterial: 5, lineBreaking: 2, controlVerification: 4, proximityToHazard: 5 },
    why_flagged: ['Direct bodily exposure to 90-bar potential projectile'],
    primary_escalation_trigger: 'Extreme Hydrogen Pressure Stem Blowout Threat',
    corrective_actions: []
  },
  {
    report_id: 'OBS-2026-0123',
    timestamp: '2026-09-11T13:40:00Z',
    unit: 'Utilities',
    site: 'Offshore Platform Alpha',
    equipment: 'GEN-02',
    equipment_full: 'Emergency Diesel Generator 1200 kVA',
    activity: 'Routine Operations',
    report_type: 'Near Miss',
    report_types: ['Near Miss'],
    raw_narrative: 'Fuel line flexible coupling on emergency generator showed significant fuel oil weeping onto hot exhaust manifold insulation cladding during scheduled weekly run.',
    ai_summary: 'Diesel fuel leaking onto high temperature generator exhaust shroud.',
    confidence: 93,
    hazards: ['Hot Surface Auto-Ignition (400°C)', 'Engine Room Flash Fire'],
    barriers: [
      { name: 'Spray Shielding & Cladding Integrity', expected: 'Required', observed: 'Anti-spray tape loose, fuel soaking into insulation', status: 'FAILED', controlType: 'Engineering' }
    ],
    iogp_rule: 'Hot Work',
    sif_potential: false,
    sif_score: 61,
    sif_classification: 'ELEVATED RISK',
    severity: 'ELEVATED',
    actual_outcome: 'Near Miss (Engine Stopped Immediately)',
    potential_consequence: 'Engine Compartment Fire / Power Loss',
    potential_outcome: 'Equipment Fire',
    precursor_tags: ['Fuel system leak', 'Hot surface proximity'],
    review_status: 'Confirmed',
    status: 'Confirmed',
    causal_pathway: [],
    sif_parameters: { energyReleasePotential: 3, barrierFailure: 3, workerExposure: 2, hazardousMaterial: 4, lineBreaking: 1, controlVerification: 3, proximityToHazard: 2 },
    why_flagged: ['Flammable liquid spraying onto auto-ignition surface'],
    primary_escalation_trigger: 'Diesel Leak on Hot Manifold Surface',
    corrective_actions: []
  }
];

export const SIF_TREND_DATA_8_WEEKS = [
  { week: 'Wk 1', sif: 5, nonSif: 8, total: 13 },
  { week: 'Wk 2', sif: 7, nonSif: 6, total: 13 },
  { week: 'Wk 3', sif: 6, nonSif: 9, total: 15 },
  { week: 'Wk 4', sif: 9, nonSif: 7, total: 16 },
  { week: 'Wk 5', sif: 8, nonSif: 10, total: 18 },
  { week: 'Wk 6', sif: 11, nonSif: 8, total: 19 },
  { week: 'Wk 7', sif: 10, nonSif: 9, total: 19 },
  { week: 'Wk 8', sif: 13, nonSif: 7, total: 20 }
];

export const RISK_DISTRIBUTION_DONUT = [
  { name: 'Critical', value: 7, color: '#ef4444' },
  { name: 'High', value: 9, color: '#f59e0b' },
  { name: 'Low / Elevated', value: 4, color: '#10b981' }
];

export const MONTHLY_SAFETY_PERFORMANCE = [
  { month: 'Mar', sif: 8, safetyActions: 18, totalReports: 28 },
  { month: 'Apr', sif: 11, safetyActions: 21, totalReports: 31 },
  { month: 'May', sif: 13, safetyActions: 22, totalReports: 34 },
  { month: 'Jun', sif: 9, safetyActions: 19, totalReports: 30 },
  { month: 'Jul', sif: 14, safetyActions: 26, totalReports: 36 },
  { month: 'Aug', sif: 16, safetyActions: 27, totalReports: 38 },
  { month: 'Sep', sif: 13, safetyActions: 18, totalReports: 20 }
];

export const SITE_RISK_DATA = [
  { site: 'Refinery Unit 3', reports: 6, sif: 5, critical: 2, color: '#1e293b' },
  { site: 'North Gas Plant', reports: 4, sif: 3, critical: 2, color: '#ef4444' },
  { site: 'Crude Terminal', reports: 3, sif: 2, critical: 1, color: '#f59e0b' },
  { site: 'Pipeline Station 7', reports: 2, sif: 2, critical: 1, color: '#10b981' },
  { site: 'South Tank Farm', reports: 3, sif: 3, critical: 1, color: '#3b82f6' },
  { site: 'Offshore Platform Alpha', reports: 2, sif: 1, critical: 0, color: '#8b5cf6' }
];

export const REPORT_TEMPLATES = [
  {
    id: 'tmpl-01',
    title: 'Executive Safety Summary',
    description: 'High-level overview for leadership with SIF risk indices, precursor trajectories, and capital barrier health.',
    icon: 'FileText',
    color: '#0f172a',
    badge: 'Executive'
  },
  {
    id: 'tmpl-02',
    title: 'SIF Potential Report',
    description: 'All SIF-potential incidents, barrier failure stack analysis, and high-energy exposure pathways.',
    icon: 'AlertOctagon',
    color: '#ef4444',
    badge: 'High Priority'
  },
  {
    id: 'tmpl-03',
    title: 'Precursor Pattern Report',
    description: 'Recurring safety patterns, contractor cluster anomalies, and predictive early-warning triggers.',
    icon: 'AlertTriangle',
    color: '#f59e0b',
    badge: 'Patterns'
  },
  {
    id: 'tmpl-04',
    title: 'Site Risk Report',
    description: 'Comprehensive risk breakdown by refinery complex, offshore asset, and gathering pipeline stations.',
    icon: 'MapPin',
    color: '#10b981',
    badge: 'Locations'
  },
  {
    id: 'tmpl-05',
    title: 'Life-Saving Rules Report',
    description: 'IOGP rule exposure tracking, non-conformance metrics, and frontline barrier verification health.',
    icon: 'ShieldCheck',
    color: '#3b82f6',
    badge: 'Compliance'
  },
  {
    id: 'tmpl-06',
    title: 'Trend Analysis Report',
    description: '8-week and multi-month safety trajectory, closure velocity of critical actions, and leading indicators.',
    icon: 'TrendingUp',
    color: '#f59e0b',
    badge: 'Analytics'
  }
];

export const RECENT_GENERATED_REPORTS = [
  { id: 'RPT-2026-08', title: 'Weekly SIF Summary — Wk 8', type: 'SIF Report', period: 'Wk 8 (Sep 2026)', date: '20 Sep 2026', status: 'Ready' },
  { id: 'RPT-2026-07', title: 'Precursor Analysis — Sep', type: 'Precursor Report', period: 'Sep 2026', date: '19 Sep 2026', status: 'Ready' },
  { id: 'RPT-2026-06', title: 'Life-Saving Rules Monthly Audit', type: 'LSR Report', period: 'Aug–Sep 2026', date: '18 Sep 2026', status: 'Ready' },
  { id: 'RPT-2026-05', title: 'Refinery Unit 3 Special HSE Assessment', type: 'Site Risk', period: 'Q3 2026', date: '16 Sep 2026', status: 'Ready' },
  { id: 'RPT-2026-04', title: 'Contractor Safety Performance Review', type: 'Audit', period: 'Aug 2026', date: '12 Sep 2026', status: 'Ready' }
];

export const SAMPLE_INCIDENT_INPUTS = [
  {
    title: 'Pump P-301 LOTO Bypass',
    text: "During maintenance on pump P-301 in Refinery Unit 3, I noticed the lockout-tagout was not verified before the technician started working. The isolation permit was signed but nobody physically confirmed the valve was closed. The worker was about to open the pump casing."
  },
  {
    title: 'Crane Lifting Pipe in Exclusion Zone',
    text: "A crane was lifting a 2-tonne pipe section near the flare stack when two workers walked through the barricaded lifting zone. The rigger shouted to stop the lift. No one was hurt but the load swung close to where they were standing."
  },
  {
    title: 'North Gas Plant Welding near Flammable Line',
    text: "At North Gas Plant, a contractor was doing welding on a line that had not been fully drained. The hot work permit was 40 minutes late for renewal and the continuous gas detector had run out of battery. Fitter was actively grinding bracket only 50cm from live sour gas pipe."
  }
];

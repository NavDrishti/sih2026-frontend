import { 
  SafetyReport, 
  UnitRiskSummary, 
  HeatmapCell, 
  LifeSavingRuleSummary, 
  CorrectiveAction, 
  NotificationItem,
  RefineryUnit,
  ActivityType
} from '../types/safety';

export const PRIMARY_REPORT_ID = 'REF-20260911-000124';

export const MOCK_REPORTS: SafetyReport[] = [
  {
    report_id: 'REF-20260911-000124',
    timestamp: '2026-09-11T09:42:00Z',
    unit: 'DHT',
    equipment: 'P-204',
    equipment_full: 'FEED PUMP P-204 SUCTION SPOOL',
    activity: 'Line Breaking',
    report_type: 'UC',
    report_types: ['UC', 'UA', 'SIF Precursor', 'Near Miss'],
    raw_narrative: 'During the shift I was asked to help the fitters open the suction spool on the diesel hydrotreater feed pump P-204 so the mechanical team could change the strainer. The isolation permit stated that the suction line had been isolated and drained. When the fitters loosened the top two bolts on the companion flange, warm gasoil started weeping out. The lead fitter said it was just residual line drainage and told us to continue cracking the bottom studs. When we loosened the bottom studs, hot pressurized gasoil suddenly sprayed out across the pump skid and splashed onto the technician\'s nomex coveralls. We immediately pulled back and sounded the local alarm. Operations responded and discovered the upstream suction block valve 04-HV-102 was leaking through significantly, the bleed valve was choked with coke fines, and no slip blind had been swung into the spectator flange.',
    ai_summary: 'Hot pressurized hydrocarbon was released during line breaking because positive isolation and zero-energy verification were not completed.',
    confidence: 94,
    hazards: ['Pressurized Hydrocarbon', 'High Temperature (185°C)', 'Flammable Atmosphere'],
    barriers: [
      {
        name: 'Double Block & Bleed',
        expected: 'Required',
        observed: 'Not provided (Single block valve 04-HV-102 leaking through)',
        status: 'FAILED',
        controlType: 'Engineering'
      },
      {
        name: 'Blind / Spade',
        expected: 'Required',
        observed: 'Missing (Spectacle blind left open / not swung)',
        status: 'FAILED',
        controlType: 'Engineering'
      },
      {
        name: 'Zero Energy Verification',
        expected: 'Required',
        observed: 'Not verified (Bleed line plugged with coke, false zero reading)',
        status: 'FAILED',
        controlType: 'Procedural'
      },
      {
        name: 'Gas Testing',
        expected: 'Required',
        observed: 'Not documented prior to breaking flange perimeter',
        status: 'WARNING',
        controlType: 'Administrative'
      },
      {
        name: 'Permit Verification',
        expected: 'Required',
        observed: 'Present (PTW-DHT-8821 signed off without field zero check)',
        status: 'VERIFIED',
        controlType: 'Administrative'
      },
      {
        name: 'PPE',
        expected: 'Required',
        observed: 'Present (Nomex coveralls, safety glasses, chemical gloves worn)',
        status: 'VERIFIED',
        controlType: 'PPE'
      }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.7,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Energy isolation verification (DBB + zero energy proof)',
    causal_pathway: [
      {
        step: '01',
        name: 'HAZARD PRESENT',
        description: 'Hot pressurized gasoil in P-204 suction line (185°C, 18 barg operating pressure)',
        isCritical: false
      },
      {
        step: '02',
        name: 'BARRIER STATUS',
        description: 'FAILED — single valve only; bleed plugged with coke fines; no spectacle blind swung',
        isCritical: true,
        barrierImpact: 'Primary containment isolation breached'
      },
      {
        step: '03',
        name: 'UNSAFE ACT / CONDITION',
        description: 'Flange bolts broken before physical zero-energy depressurization verification',
        isCritical: true
      },
      {
        step: '04',
        name: 'PHYSICAL MECHANISM',
        description: 'Pressurized hot hydrocarbon jet release via parted flange gap across pump deck',
        isCritical: true
      },
      {
        step: '05',
        name: 'POTENTIAL EXPOSURE',
        description: 'Worker positioned directly in line of fire / horizontal spray path',
        isCritical: true
      },
      {
        step: '06',
        name: 'POTENTIAL OUTCOME',
        description: 'Thermal flash fire / severe 3rd-degree hydrotreater gasoil burns / fatality potential',
        isCritical: true
      }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 5,
      controlVerification: 5,
      proximityToHazard: 4
    },
    why_flagged: [
      'High-energy pressurized hydrocarbon present (185°C / 18 barg)',
      'Positive mechanical isolation not confirmed prior to work',
      'Engineered containment barrier failure detected (DBB bypassed)',
      'Worker physically exposed in direct line-of-fire jet path',
      'Line-breaking activity without zero-energy physical proof',
      'Bleed point plugged resulting in false zero-pressure reading'
    ],
    primary_escalation_trigger: 'Barrier failure during line breaking involving pressurized hydrocarbon.',
    reporter_role: 'Mechanical Maintenance Technician',
    corrective_actions: [
      {
        action_id: 'ACT-20260911-0042',
        report_id: 'REF-20260911-000124',
        description: 'Restore positive isolation and verify DBB arrangement before resuming line-breaking activity on P-204 spool.',
        priority: 'CRITICAL',
        owner: 'Mechanical Maintenance & Operations',
        unit: 'DHT',
        due_date: '2026-09-12',
        status: 'OPEN',
        notes: 'Immediate safety stop issued for DHT maintenance train.'
      },
      {
        action_id: 'ACT-20260911-0043',
        report_id: 'REF-20260911-000124',
        description: 'Unclog and inspect all high-temperature bleeders across DHT feed pumps and recertify zero-energy protocol.',
        priority: 'HIGH',
        owner: 'Reliability Inspection Team',
        unit: 'DHT',
        due_date: '2026-09-15',
        status: 'IN PROGRESS'
      }
    ]
  },
  {
    report_id: 'REF-20260910-000889',
    timestamp: '2026-09-10T14:15:00Z',
    unit: 'FCC',
    equipment: 'R-201',
    equipment_full: 'REGENERATOR CATALYST SLIDE VALVE SV-201',
    activity: 'Hot Work',
    report_type: 'UA',
    report_types: ['UA', 'SIF Precursor'],
    raw_narrative: 'Contract welder ignited cutting torch directly beneath the catalyst slide valve bypass line without conducting a continuous LEL gas test. Operator passing by noticed no dedicated fire watch was present at elevation +22m and hot slag was dripping toward the slurry exchanger flange.',
    ai_summary: 'Hot cutting torch initiated beneath live catalyst slide valve without required continuous flammable gas monitoring or designated fire watch.',
    confidence: 96,
    hazards: ['Flammable Atmosphere', 'High Temperature Slurry', 'Elevation Line of Fire'],
    barriers: [
      { name: 'Continuous Gas Monitoring', expected: 'Required', observed: 'Missing (Sniffer left on deck)', status: 'FAILED' },
      { name: 'Fire Watch Sentinel', expected: 'Required', observed: 'Absent from assigned elevation', status: 'FAILED' },
      { name: 'Fire Blanket Slag Containment', expected: 'Required', observed: 'Partially installed, open gaps', status: 'WARNING' },
      { name: 'Hot Work Permit', expected: 'Required', observed: 'Signed off', status: 'VERIFIED' }
    ],
    iogp_rule: 'Hot Work',
    sif_potential: true,
    sif_score: 4.5,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Active fire watch and continuous flammable gas testing bypassed',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Hydrocarbon vapours and 540°C catalyst loop in immediate proximity', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — fire watch abandoned post; zero gas verification', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Cutting torch struck above unshielded heavy oil flanges', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Incandescent sparks dropping onto flange weeping packing', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Technicians on elevated steel structure without alternate egress', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Catastrophic flash fire and structural collapse on FCC regenerator deck', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 4,
      lineBreaking: 3,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      'Hot work initiated in Class 1 Div 1 zone without active combustible gas testing',
      'Mandatory safety barrier (Fire Watch) abandoned',
      'Slag impingement over hydrocarbon piping',
      'Elevated work location restricting rapid emergency evacuation'
    ],
    primary_escalation_trigger: 'Hot work ignition source introduced in explosive atmosphere boundary without barrier verification.',
    reporter_role: 'Operations Shift Supervisor',
    corrective_actions: [
      {
        action_id: 'ACT-20260910-0038',
        report_id: 'REF-20260910-000889',
        description: 'Revoke hot work permit HW-FCC-419 and conduct safety stand-down with refractory welding contractor.',
        priority: 'CRITICAL',
        owner: 'HSSE Field Safety Specialist',
        unit: 'FCC',
        due_date: '2026-09-11',
        status: 'CLOSED',
        notes: 'Stand-down held with 34 contractor personnel.'
      }
    ]
  },
  {
    report_id: 'REF-20260909-000732',
    timestamp: '2026-09-09T18:30:00Z',
    unit: 'SRU',
    equipment: 'E-302',
    equipment_full: 'SULFUR CONDENSER E-302 RUN-DOWN LINE',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor', 'UC'],
    raw_narrative: 'Instrument tech opened transmitter enclosure on H2S rich acid gas header while wearing only half-mask air purifying respirator instead of supplied airline breathing apparatus (SABA). Personal 4-gas badge alarmed instantly at 45 ppm H2S. Technician retreated immediately down the stairway.',
    ai_summary: 'Personnel entered acute H2S exposure boundary with inadequate respiratory barrier protection; personal monitor alarmed at 45 ppm H2S.',
    confidence: 97,
    hazards: ['H2S Toxic Gas (IDLH > 100ppm)', 'Acid Gas Header Pressure'],
    barriers: [
      { name: 'Supplied Air Breathing Apparatus (SABA)', expected: 'Required', observed: 'Omitted (Half-mask APR used)', status: 'FAILED' },
      { name: 'Fixed Area Toxic Detector', expected: 'Required', observed: 'Operating normally, beacon flashing', status: 'VERIFIED' },
      { name: 'Personal Multi-Gas Monitor', expected: 'Required', observed: 'Alarmed at 45 ppm, initiated retreat', status: 'VERIFIED' },
      { name: 'Buddy System Protocol', expected: 'Required', observed: 'Technician working alone', status: 'FAILED' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: true,
    sif_score: 4.6,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Respiratory protection downgrade in designated IDLH toxic gas perimeter',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Concentrated Hydrogen Sulfide (H2S) in Claus condenser tail gas', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — SABA respiratory barrier omitted; lone worker violation', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Approach to leaking transmitter packing with organic cartridge mask', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Fugitive toxic gas cloud inhalation potential (>100 ppm lethal)', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Solo worker directly over acid gas packing gland', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Rapid olfactory paralysis, acute systemic toxicity, fatal knockdown', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 5,
      lineBreaking: 2,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: [
      'IDLH toxic agent (H2S) present in concentration exceeding life-safety thresholds',
      'Life-preserving respiratory barrier bypassed (SABA downgraded to APR)',
      'Worker operated without designated safety standby/buddy',
      'High fatality probability upon olfactory fatigue'
    ],
    primary_escalation_trigger: 'Defective life-critical barrier during entry into designated lethal toxic atmosphere.',
    reporter_role: 'Lead Instrument Technician',
    corrective_actions: [
      {
        action_id: 'ACT-20260909-0012',
        report_id: 'REF-20260909-000732',
        description: 'Pack and clamp leaking valve packing on E-302 manifold and restrict SRU grade 3 access.',
        priority: 'CRITICAL',
        owner: 'SRU Area Operations Lead',
        unit: 'SRU',
        due_date: '2026-09-10',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260908-000620',
    timestamp: '2026-09-08T11:00:00Z',
    unit: 'Hydrocracker',
    equipment: 'C-301',
    equipment_full: 'RECYCLE HYDROGEN COMPRESSOR STAGE 2 SUCTION',
    activity: 'Startup',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'During startup pressurization of the Stage 2 recycle loop, interlock bypass switch for high-discharge temperature was left in the override position from earlier loop commissioning. Pressure reached 135 barg before shift engineer flagged the un-cleared bypass tag on the DCS console.',
    ai_summary: 'High-pressure hydrogen compressor operated with safety instrumented system (SIS) shutdown interlock bypassed during loop pressurization.',
    confidence: 95,
    hazards: ['Hydrogen (135 barg)', 'High Pressure Explosive Gas', 'Extreme Thermal Energy'],
    barriers: [
      { name: 'Safety Instrumented Interlock (SIL-3)', expected: 'Required', observed: 'Bypassed with physical override key', status: 'FAILED' },
      { name: 'Management of Change (MOC) Bypass Authorization', expected: 'Required', observed: 'Expired at 08:00 without extension', status: 'FAILED' },
      { name: 'DCS Independent High Pressure Trip', expected: 'Required', observed: 'Functional, alarmed at 134 barg', status: 'VERIFIED' }
    ],
    iogp_rule: 'Bypassing Safety Controls',
    sif_potential: true,
    sif_score: 4.8,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'SIL-3 protective loop bypassed without valid active override permit',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: '135 barg hydrogen recycle stream with high auto-ignition propensity', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — SIL-3 high temperature shutdown defeated via manual key switch', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Machine started while critical safety instrument system inhibited', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Compressor thermal runaway leading to cylinder head seal rupture', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Operating personnel executing local vibration rounds on compressor deck', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'High-pressure hydrogen jet fire, BLEVE, multi-fatality plant event', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 1,
      controlVerification: 5,
      proximityToHazard: 4
    },
    why_flagged: [
      '135 barg hydrogen envelope operated without automatic safety interlock protection',
      'Uncontrolled safety control bypass without valid MOC authorization',
      'Severe catastrophic loss of containment potential in hydroprocessing block'
    ],
    primary_escalation_trigger: 'Critical safety instrumented function (SIF/SIS) defeated during high-pressure hydrogen startup.',
    reporter_role: 'Senior Process Control Specialist',
    corrective_actions: [
      {
        action_id: 'ACT-20260908-0029',
        report_id: 'REF-20260908-000620',
        description: 'Audit all active DCS bypass keys across Hydrocracker complex and reinstate SIL-3 trip trip logic.',
        priority: 'CRITICAL',
        owner: 'Process Automation Manager',
        unit: 'Hydrocracker',
        due_date: '2026-09-09',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260907-000491',
    timestamp: '2026-09-07T16:20:00Z',
    unit: 'Tank Farm',
    equipment: 'TK-401',
    equipment_full: 'EXTERNAL FLOATING ROOF CRUDE STORAGE TANK TK-401',
    activity: 'Confined Space Entry',
    report_type: 'UA',
    report_types: ['UA', 'SIF Precursor'],
    raw_narrative: 'Contract cleaning crew climbed onto the floating roof pontoon of crude tank TK-401 while the tank was actively receiving crude from the pipeline at 1,200 m3/h. The permit strictly prohibited entry during live filling due to pontoon tilting and vapour displacement risks.',
    ai_summary: 'Personnel climbed onto floating roof deck of crude tank during live pipeline filling; violates critical confined space pontoon rules.',
    confidence: 93,
    hazards: ['Crude Oil Vapours (LEL > 25%)', 'H2S Pockets', 'Roof Sinking / Tilting Hazard'],
    barriers: [
      { name: 'Confined Space Entry Permit (Live Transfer Embargo)', expected: 'Required', observed: 'Violated (Entry conducted while tank pumping in)', status: 'FAILED' },
      { name: 'Continuous Pontoon Gas Detection', expected: 'Required', observed: 'Monitor stationed at top wind girder, not on roof', status: 'FAILED' },
      { name: 'Harness / Retrievable Lifeline', expected: 'Required', observed: 'Worn but anchor line not secured to ladder trolley', status: 'FAILED' }
    ],
    iogp_rule: 'Confined Space',
    sif_potential: true,
    sif_score: 4.4,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    p2h_rating: 'P2H 4/5',
    critical_control_failure: 'Entry into floating roof vapor space under active pipeline crude filling conditions',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Massive volume crude oil displacement generating explosive vapor boundary', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — entry prohibition during transfer violated; lifeline unattached', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Three cleaners descending to floating deck during 1,200 m3/h filling', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Sudden gas blanket puffing past primary rim seal into breathing zone', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Cleaners on floating deck with only single spiral ladder ascent path', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Asphyxiation / toxic knockdown and drowning inside crude tank roof deck', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 4,
      lineBreaking: 1,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: [
      'Entry into confined space during dynamic hydrocarbon product movement',
      'Multiple fall-protection and atmospheric monitoring barriers compromised',
      'High fatality severity in event of crude roof hydrocarbon release'
    ],
    primary_escalation_trigger: 'Confined space entry into hydrocarbon vapor blanket during active product filling.',
    reporter_role: 'Offsites Area Inspector',
    corrective_actions: [
      {
        action_id: 'ACT-20260907-0018',
        report_id: 'REF-20260907-000491',
        description: 'Install positive mechanical padlocks on TK-401 stair access gate interlocked with pipeline valve position switches.',
        priority: 'HIGH',
        owner: 'Offsites Asset Engineer',
        unit: 'Tank Farm',
        due_date: '2026-09-14',
        status: 'AWAITING VERIFICATION'
      }
    ]
  },
  {
    report_id: 'REF-20260906-000311',
    timestamp: '2026-09-06T08:45:00Z',
    unit: 'CDU',
    equipment: 'V-101',
    equipment_full: 'DESALTER VESSEL V-101 TRANSFORMER DECK',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Electrician began working on 25kV high-voltage bushing transformer terminals on crude desalter V-101. Grounding rods were never applied to the busbars after de-energizing the main feeder breaker, leaving substantial capacitive charge on the internal grid plates.',
    ai_summary: '25kV desalter grid transformer approached without earthing/grounding verification following primary breaker trip.',
    confidence: 98,
    hazards: ['25kV High Voltage Electricity', 'Capacitive Stored Energy', 'Crude Oil Atmosphere'],
    barriers: [
      { name: 'Temporary Grounding Cluster (Earthing Verification)', expected: 'Required', observed: 'Omitted (Grounding stabs hanging on rack)', status: 'FAILED' },
      { name: 'Electrical LOTO Verification', expected: 'Required', observed: 'Lock applied on breaker, zero-potential test skipped', status: 'WARNING' },
      { name: 'Arc Flash Suit Category 4', expected: 'Required', observed: 'Standard Nomex only', status: 'FAILED' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.7,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Earthing and zero-voltage proof omitted on 25kV electrostatic desalter system',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Residual 25,000 Volt electrostatic charge stored in desalter grid plates', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — earth grounding cluster not attached; arc flash PPE absent', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Hand tool inserted into transformer terminal box without zero-volt prove', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Arc flash discharge / high-current electrical discharge', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Electrician leaning directly into open high-voltage bushing housing', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Fatal electrocution / severe arc flash thermal blast trauma', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 2,
      lineBreaking: 1,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      'High-voltage electrical stored energy (25kV) without positive discharge ground',
      'Life-critical zero-energy verification procedure violated',
      'Worker positioned within arc-flash boundary without certified arc-rated gear'
    ],
    primary_escalation_trigger: 'Breach of electrical high-voltage isolation without grounding and zero-energy proof.',
    reporter_role: 'Electrical Maintenance Supervisor',
    corrective_actions: [
      {
        action_id: 'ACT-20260906-0005',
        report_id: 'REF-20260906-000311',
        description: 'Mandate live-line tester prove-test-prove workflow sign-off on CDU electrical isolations.',
        priority: 'CRITICAL',
        owner: 'Chief Electrical Engineer',
        unit: 'CDU',
        due_date: '2026-09-08',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260905-000194',
    timestamp: '2026-09-05T13:10:00Z',
    unit: 'VDU',
    equipment: 'F-102',
    equipment_full: 'VACUUM CHARGE HEATER F-102 CONVECTION SECTION',
    activity: 'Working at Height',
    report_type: 'UC',
    report_types: ['UC', 'Near Miss'],
    raw_narrative: 'Scaffold planks on the 4th deck of vacuum furnace F-102 were found unsecured and missing toe-boards. While insulators were stripping mineral wool lagging, a steel pipe clamp slipped through the 15cm deck gap and dropped 18 meters to the burner floor, landing 2 meters from an operator.',
    ai_summary: 'Unsecured scaffold deck with missing kick-plates allowed heavy clamp to drop 18m onto active burner floor in line of fire.',
    confidence: 91,
    hazards: ['Dropped Object (18m drop height)', 'Live Burner Floor Line of Fire'],
    barriers: [
      { name: 'Toe-boards & Netting Containment', expected: 'Required', observed: 'Missing on 2 sides of scaffold', status: 'FAILED' },
      { name: 'Drop Zone Barricading', expected: 'Required', observed: 'Red danger tape missing on burner floor', status: 'FAILED' },
      { name: 'Tool Tethering Lanyard', expected: 'Required', observed: 'Tool dropped was loose hardware', status: 'WARNING' }
    ],
    iogp_rule: 'Working at Height',
    sif_potential: true,
    sif_score: 4.1,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    p2h_rating: 'P2H 4/5',
    critical_control_failure: 'Overhead drop barrier and lower exclusion zone boundary omitted',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Elevated scaffold work 18 meters directly above manned burner platform', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — toe-boards missing; lower perimeter barricade absent', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Insulators handling loose pipe fittings without containment nets', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Gravitational acceleration of 4.2 kg steel clamp dropping 18m', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Operator conducting burner flame inspection rounds below', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Fatal blunt force cranial trauma from falling object', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 4,
      workerExposure: 4,
      hazardousMaterial: 1,
      lineBreaking: 1,
      controlVerification: 3,
      proximityToHazard: 4
    },
    why_flagged: [
      'High-potential dropped object energy (>150 Joules impact force)',
      'Multiple primary barrier failures (toe-boards, containment tarps, barricades)',
      'Personnel actively working inside unbarricaded drop footprint'
    ],
    primary_escalation_trigger: 'Dropped object with lethal kinetic energy trajectory over unbarricaded work area.',
    reporter_role: 'Operations Area Operator',
    corrective_actions: [
      {
        action_id: 'ACT-20260905-0011',
        report_id: 'REF-20260905-000194',
        description: 'Tag out scaffold VDU-SC-204 and install 100% fine mesh netting around burner deck perimeter.',
        priority: 'HIGH',
        owner: 'Scaffold Safety Coordinator',
        unit: 'VDU',
        due_date: '2026-09-06',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260904-000088',
    timestamp: '2026-09-04T10:20:00Z',
    unit: 'NHT',
    equipment: 'V-101',
    equipment_full: 'NAPHTHA FEED SURGE DRUM V-101 GAUGE GLASS',
    activity: 'Line Breaking',
    report_type: 'UA',
    report_types: ['UA', 'SIF Precursor'],
    raw_narrative: 'While repacking a leaking armored level gauge cock on naphtha surge drum V-101, technician unbolted the bonnet with only a single quarter-turn isolation valve holding back 22 barg of boiling range naphtha. When the bonnet shifted, liquid naphtha sprayed onto the hot valve body.',
    ai_summary: 'Line breaking on pressurized 22 barg light naphtha performed with single unverified isolation valve; high vapor flash potential.',
    confidence: 94,
    hazards: ['Pressurized Light Naphtha', 'Benzene Carcinogen', 'Low Auto-Ignition Temperature'],
    barriers: [
      { name: 'Double Isolation / Bleed', expected: 'Required', observed: 'Single ball valve only', status: 'FAILED' },
      { name: 'Depressurization & Drain Verify', expected: 'Required', observed: 'Drain valve was seized shut, assumed depressurized', status: 'FAILED' },
      { name: 'Chemical Protective Splash Suit', expected: 'Required', observed: 'Basic cotton coveralls worn', status: 'FAILED' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.6,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Single valve isolation breached without drain verification on pressurized light hydrocarbon',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: '22 barg volatile naphtha with low flash point (< -20°C)', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — single un-isolated valve; drain seized; no secondary blind', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Bonnet bolts backed out without verifying drain discharge clear', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Naphtha flashing to vapor upon pressure drop to atmospheric', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Technician directly over valve bonnet holding wrenches', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Vapor cloud ignition / fatal deflagration / severe toxic benzene exposure', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 5,
      lineBreaking: 5,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      'High-volatility flammable hydrocarbon pressurized to 22 barg',
      'Assumed depressurization without positive proof (seized drain)',
      'Single isolation barrier used in place of mandatory dual isolation',
      'Immediate flash-fire exposure potential'
    ],
    primary_escalation_trigger: 'Line breaking on pressurized naphtha without dual barrier isolation or zero-energy proof.',
    reporter_role: 'Operations Process Technician',
    corrective_actions: [
      {
        action_id: 'ACT-20260904-0003',
        report_id: 'REF-20260904-000088',
        description: 'Replace seized drain valve on V-101 gauge column and conduct plant-wide audit of level gauge isolations.',
        priority: 'CRITICAL',
        owner: 'Piping & Valve Reliability Lead',
        unit: 'NHT',
        due_date: '2026-09-07',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260903-000951',
    timestamp: '2026-09-03T15:40:00Z',
    unit: 'DHT',
    equipment: 'R-201',
    equipment_full: 'HYDROTREATING REACTOR R-201 CATALYST BED',
    activity: 'Confined Space Entry',
    report_type: 'SIF Precursor',
    report_types: ['SIF Precursor', 'Near Miss'],
    raw_narrative: 'Catalyst unloading technicians were about to enter reactor R-201 under nitrogen inert atmosphere. The entry technician\'s helmet communication umbilical was tangled and the primary life-support breathing hose showed severe kinks that reduced air flow to under 40 L/min. Standby man caught the low flow alarm before technician stepped past the manway.',
    ai_summary: 'Nitrogen inert atmosphere confined space entry halted when life-support air supply hose kinked below minimum flow threshold.',
    confidence: 98,
    hazards: ['Nitrogen Asphyxiation (0% O2)', 'Immediate Fatal Knockdown (<15s)'],
    barriers: [
      { name: 'Dual Breathing Air Supply Console', expected: 'Required', observed: 'Primary hose kinked, secondary cylinder offline', status: 'FAILED' },
      { name: 'Confined Space Standby Attendant', expected: 'Required', observed: 'Intervened at manway perimeter before entry', status: 'VERIFIED' },
      { name: 'Audio/Visual Communications Link', expected: 'Required', observed: 'Intermittent signal', status: 'WARNING' }
    ],
    iogp_rule: 'Confined Space',
    sif_potential: true,
    sif_score: 4.9,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Inert nitrogen breathing air life-support redundancy failed',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: '100% Nitrogen asphyxiating atmosphere inside reactor vessel', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — life support air delivery degraded below survival volume', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Technician positioned at manway threshold with compromised umbilical', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Sudden anoxia upon single inhalation of nitrogen atmosphere', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Worker entering interior catalyst dump tray elevation', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Immediate loss of consciousness (<15s) and fatal asphyxiation inside reactor', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 5,
      lineBreaking: 1,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      '100% nitrogen inert confined space with instant asphyxiation consequence',
      'Life-support breathing air delivery system compromised',
      'Redundant air backup not aligned prior to entry attempt'
    ],
    primary_escalation_trigger: 'Compromised life-support umbilical prior to entry into zero-oxygen inert atmosphere.',
    reporter_role: 'Confined Space Specialist',
    corrective_actions: [
      {
        action_id: 'ACT-20260903-0017',
        report_id: 'REF-20260903-000951',
        description: 'Recertify all nitrogen life-support consoles and replace kink-prone flexible umbilicals with reinforced braided lines.',
        priority: 'CRITICAL',
        owner: 'Refinery HSSE Director',
        unit: 'DHT',
        due_date: '2026-09-04',
        status: 'CLOSED',
        notes: 'Umbilicals replaced and flow testing verified across all rigs.'
      }
    ]
  },
  {
    report_id: 'REF-20260902-000812',
    timestamp: '2026-09-02T11:25:00Z',
    unit: 'FCC',
    equipment: 'P-117',
    equipment_full: 'MAIN FRACTIONATOR BOTTOMS SLURRY PUMP P-117B',
    activity: 'Line Breaking',
    report_type: 'UC',
    report_types: ['UC', 'SIF Precursor'],
    raw_narrative: 'Flange between pump P-117B casing and discharge check valve was opened for seal replacement. The mechanical seal flush line was found pressurized with hot gas oil because the flush throttle needle valve was passing and was not included on the LOTO isolation list.',
    ai_summary: 'Unlisted auxiliary mechanical seal flush line remained pressurized with hot gasoil during pump line breaking.',
    confidence: 93,
    hazards: ['Hot Slurry / Gas Oil (330°C)', 'High Pressure Seal Flush'],
    barriers: [
      { name: 'Comprehensive LOTO Boundary Isolation', expected: 'Required', observed: 'Omitted (Seal flush auxiliary branch left off blind list)', status: 'FAILED' },
      { name: 'Line-Breaking Dual Isolation', expected: 'Required', observed: 'Auxiliary line un-isolated', status: 'FAILED' },
      { name: 'Flange Deflector Shield', expected: 'Required', observed: 'Installed correctly and contained initial jet', status: 'VERIFIED' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.5,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Auxiliary piping omitted from process isolation boundary',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: '330°C heavy gasoil seal flush under 14 barg pump head', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — auxiliary line not locked or blinded in isolation boundary', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Piping opened with unisolated auxiliary hydrocarbon connection', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Pressurized thermal fluid release around pump seal chamber', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Fitters dismantling seal housing directly in front of flange', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Severe 3rd degree burns from 330°C hydrocarbon auto-ignition', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 5,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: [
      'High temperature hydrocarbon (330°C) above auto-ignition threshold',
      'Incomplete isolation boundary omitting auxiliary seal flush branch',
      'Direct line-of-fire exposure during pump disassembly'
    ],
    primary_escalation_trigger: 'Omission of pressurized auxiliary hydrocarbon branch from mechanical isolation boundary.',
    reporter_role: 'Rotating Equipment Specialist',
    corrective_actions: [
      {
        action_id: 'ACT-20260902-0008',
        report_id: 'REF-20260902-000812',
        description: 'Update P&ID and isolation standard drawings for P-117 A/B to mandate blind plate on seal flush header.',
        priority: 'CRITICAL',
        owner: 'Process Engineering Manager',
        unit: 'FCC',
        due_date: '2026-09-05',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260901-000419',
    timestamp: '2026-09-01T09:10:00Z',
    unit: 'SRU',
    equipment: 'R-201',
    equipment_full: 'CLAUS REACTION FURNACE BURNER ASSEMBLY',
    activity: 'Hot Work',
    report_type: 'UA',
    report_types: ['UA', 'SIF Precursor'],
    raw_narrative: 'Contractor began grinding on the combustion air intake damper adjacent to the Claus burner while acid gas was flowing to the furnace. Grinding spark shower directed toward burner sight glass where packing was visibly weeping sulfur and acid gas.',
    ai_summary: 'Grinding sparks impinged on weeping acid gas burner sight glass during live furnace operation.',
    confidence: 92,
    hazards: ['Toxic Acid Gas', 'Ignition of Sulfur Vapours', 'Thermal Radiation'],
    barriers: [
      { name: 'Spark Containment Barrier / Blanket', expected: 'Required', observed: 'Missing (Grinding sparks flying 6 meters)', status: 'FAILED' },
      { name: 'Acid Gas Boundary Gas Testing', expected: 'Required', observed: 'Performed 4 hours prior, not continuous', status: 'WARNING' },
      { name: 'Designated Fire Watch', expected: 'Required', observed: 'Fire watch was on phone 15m away', status: 'FAILED' }
    ],
    iogp_rule: 'Hot Work',
    sif_potential: true,
    sif_score: 4.3,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    p2h_rating: 'P2H 4/5',
    critical_control_failure: 'Hot work spark trajectory directed into fugitive acid gas leak point',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Flammable H2S and sulfur vapors weeping around burner port', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — no fire blanket; inattentive fire watch; no continuous monitoring', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Grinding wheel thrown sparks directed against live acid gas joint', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Ignition of escaping acid gas jet producing SO2 toxic flash fire', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Grinder operator and nearby scaffold crew on furnace burner deck', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Acute toxic exposure, airway burning, fatal acid gas inhalation', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 4,
      workerExposure: 4,
      hazardousMaterial: 5,
      lineBreaking: 1,
      controlVerification: 4,
      proximityToHazard: 5
    },
    why_flagged: [
      'Grinding sparks introduced within 1 meter of weeping toxic/flammable joint',
      'Active fire-watch barrier neglected',
      'High fatality potential associated with sulfur plant acid gas ignition'
    ],
    primary_escalation_trigger: 'Uncontrolled grinding sparks directed at leaking acid gas containment boundary.',
    reporter_role: 'Operations Safety Field Officer',
    corrective_actions: [
      {
        action_id: 'ACT-20260901-0002',
        report_id: 'REF-20260901-000419',
        description: 'Stop hot work, replace burner sight glass packing gland, and issue violation notice to contractor.',
        priority: 'HIGH',
        owner: 'SRU HSSE Safety Lead',
        unit: 'SRU',
        due_date: '2026-09-02',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260830-000782',
    timestamp: '2026-08-30T14:50:00Z',
    unit: 'CDU',
    equipment: 'P-101',
    equipment_full: 'CRUDE CHARGE PUMP P-101A DUAL SUCTION STRAINER',
    activity: 'Line Breaking',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Operators switched strainers while crude feed rate was 2,400 m3/h. The isolated strainer basket cover quick-opening yoke was released before cracking the manual vent valve. A pocket of trapped high-temperature crude oil vapor popped the lid open under 4 barg residual head.',
    ai_summary: 'Quick-opening filter lid opened under residual 4 barg crude vapor pressure before depressurization vent verification.',
    confidence: 95,
    hazards: ['Pressurized Crude Oil', 'Volatile Flash Vapour', 'Mechanical Kinetic Shock'],
    barriers: [
      { name: 'Depressurization Vent Verification', expected: 'Required', observed: 'Omitted (Vent valve never cracked before yoke unclamp)', status: 'FAILED' },
      { name: 'Zero Energy Proof', expected: 'Required', observed: 'Not documented', status: 'FAILED' },
      { name: 'Quick-Opening Interlock Pin', expected: 'Required', observed: 'Damaged mechanical interlock pin allowed unclamp', status: 'FAILED' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.4,
    sif_classification: 'HIGH SIF POTENTIAL',
    severity: 'HIGH',
    p2h_rating: 'P2H 4/5',
    critical_control_failure: 'Safety interlock bypassed on pressurized quick-opening strainer closure',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: 'Crude oil under 4 barg residual hydraulic and vapor pressure', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — interlock pin sheared; vent valve closed; zero energy skipped', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Clamp yoke lever pulled while vessel still under pressure', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Heavy steel cover violently propelled outward by pressurized gas pocket', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Operator standing directly in front of opening swing arc', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Fatal mechanical impact trauma and high-volume crude splash', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 4,
      barrierFailure: 5,
      workerExposure: 4,
      hazardousMaterial: 4,
      lineBreaking: 4,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      'Stored hydraulic/pneumatic energy released suddenly during line breaking',
      'Mechanical interlock on quick-opening closure failed',
      'Operator positioned in line of projectile trajectory'
    ],
    primary_escalation_trigger: 'Quick-opening pressure enclosure unclamped without verifying zero internal pressure.',
    reporter_role: 'Operations Outside Operator',
    corrective_actions: [
      {
        action_id: 'ACT-20260830-0014',
        report_id: 'REF-20260830-000782',
        description: 'Replace mechanical interlock assemblies on all crude charge strainer yokes and mandate two-person verification.',
        priority: 'HIGH',
        owner: 'CDU Maintenance Supervisor',
        unit: 'CDU',
        due_date: '2026-09-02',
        status: 'CLOSED'
      }
    ]
  },
  {
    report_id: 'REF-20260829-000551',
    timestamp: '2026-08-29T10:05:00Z',
    unit: 'Tank Farm',
    equipment: 'P-117',
    equipment_full: 'GASOLINE BLENDING TRANSFER PUMP P-117',
    activity: 'Maintenance',
    report_type: 'Near Miss',
    report_types: ['Near Miss', 'SIF Precursor'],
    raw_narrative: 'Mechanic placed hand inside the coupling guard of gasoline transfer pump P-117 to inspect alignment while the motor circuit breaker was tagged out, but the emergency local stop pushbutton had not been depressed or padlocked. DCS operator attempted remote motor spin test unaware.',
    ai_summary: 'Technician reached into rotating equipment coupling while electrical breaker lock was applied without motor field isolation verification.',
    confidence: 94,
    hazards: ['Rotating Equipment (3,000 RPM)', 'Remote DCS Start Initiation', 'Stored Rotational Kinetic Energy'],
    barriers: [
      { name: 'Field Local Stop Lockout (LOTO)', expected: 'Required', observed: 'Omitted (Local PB not padlocked)', status: 'FAILED' },
      { name: 'Try-Step Verification (Zero Energy Spin Test)', expected: 'Required', observed: 'Omitted prior to removing safety guard', status: 'FAILED' },
      { name: 'Coupling Guard Barrier', expected: 'Required', observed: 'Removed without permit clearance', status: 'FAILED' }
    ],
    iogp_rule: 'Energy Isolation',
    sif_potential: true,
    sif_score: 4.6,
    sif_classification: 'IMMINENT SIF POTENTIAL',
    severity: 'CRITICAL',
    p2h_rating: 'P2H 5/5',
    critical_control_failure: 'Field zero-energy spin verification omitted before rotating equipment inspection',
    causal_pathway: [
      { step: '01', name: 'HAZARD PRESENT', description: '250 kW electric motor with high torque rotating shaft coupling', isCritical: false },
      { step: '02', name: 'BARRIER STATUS', description: 'FAILED — field stop unlatched; try-step skipped; guard removed', isCritical: true },
      { step: '03', name: 'UNSAFE ACT / CONDITION', description: 'Hand placed directly into rotating coupling zone during remote start cycle', isCritical: true },
      { step: '04', name: 'PHYSICAL MECHANISM', description: 'Sudden high-torque motor start catching mechanic clothing / limb', isCritical: true },
      { step: '05', name: 'POTENTIAL EXPOSURE', description: 'Technician kneeling over open pump coupling without line of sight to control room', isCritical: true },
      { step: '06', name: 'POTENTIAL OUTCOME', description: 'Catastrophic traumatic amputation / fatal entanglement', isCritical: true }
    ],
    sif_parameters: {
      energyReleasePotential: 5,
      barrierFailure: 5,
      workerExposure: 5,
      hazardousMaterial: 2,
      lineBreaking: 1,
      controlVerification: 5,
      proximityToHazard: 5
    },
    why_flagged: [
      'Rotating mechanical power (250 kW) without field lock or zero-energy try-step',
      'Worker physically positioned inside machinery entrapment zone',
      'Remote automated start capability remaining active'
    ],
    primary_escalation_trigger: 'Physical intrusion into rotating equipment coupling without verified zero-energy lockout.',
    reporter_role: 'Mechanical Maintenance Inspector',
    corrective_actions: [
      {
        action_id: 'ACT-20260829-0021',
        report_id: 'REF-20260829-000551',
        description: 'Implement mandatory physical try-step test witnessed by operations before coupling guard removal across all pump skids.',
        priority: 'CRITICAL',
        owner: 'Refinery Machinery Manager',
        unit: 'Tank Farm',
        due_date: '2026-09-01',
        status: 'CLOSED'
      }
    ]
  }
];

// Top Unit Risk Summary Data matching user requirement 4 & 14
export const MOCK_UNIT_RISK_SUMMARIES: UnitRiskSummary[] = [
  {
    unit: 'DHT',
    observations: 105,
    sif_precursors: 50,
    critical_failures: 11,
    open_actions: 7,
    dominant_hazard: 'Pressurized Hydrocarbon & H2S',
    risk_score: 92,
    trend: 'UP'
  },
  {
    unit: 'FCC',
    observations: 94,
    sif_precursors: 45,
    critical_failures: 9,
    open_actions: 5,
    dominant_hazard: 'Hot Catalyst & Slurry Flanges',
    risk_score: 87,
    trend: 'UP'
  },
  {
    unit: 'SRU',
    observations: 77,
    sif_precursors: 37,
    critical_failures: 7,
    open_actions: 4,
    dominant_hazard: 'Lethal H2S & Acid Gas',
    risk_score: 81,
    trend: 'STABLE'
  },
  {
    unit: 'CDU',
    observations: 72,
    sif_precursors: 34,
    critical_failures: 6,
    open_actions: 3,
    dominant_hazard: 'High-Temperature Crude & Light Ends',
    risk_score: 76,
    trend: 'STABLE'
  },
  {
    unit: 'Tank Farm',
    observations: 72,
    sif_precursors: 34,
    critical_failures: 6,
    open_actions: 4,
    dominant_hazard: 'Vapour Displacement & Floating Roofs',
    risk_score: 74,
    trend: 'DOWN'
  },
  {
    unit: 'Hydrocracker',
    observations: 55,
    sif_precursors: 26,
    critical_failures: 5,
    open_actions: 3,
    dominant_hazard: 'High Pressure Hydrogen (140 barg)',
    risk_score: 79,
    trend: 'UP'
  },
  {
    unit: 'VDU',
    observations: 44,
    sif_precursors: 21,
    critical_failures: 4,
    open_actions: 2,
    dominant_hazard: 'Furnace Coil Leaks & Height Drops',
    risk_score: 63,
    trend: 'DOWN'
  },
  {
    unit: 'NHT',
    observations: 33,
    sif_precursors: 16,
    critical_failures: 2,
    open_actions: 2,
    dominant_hazard: 'Volatile Naphtha & Benzene Flanges',
    risk_score: 58,
    trend: 'DOWN'
  }
];

// 8x8 Unit x Activity Risk Heatmap (Requirement 15)
export const MOCK_HEATMAP_DATA: HeatmapCell[] = [
  // DHT
  { unit: 'DHT', activity: 'Startup', score: 2, observation_count: 8, sif_precursor_count: 3, top_failed_barrier: 'Permit Verification', common_iogp_rule: 'Energy Isolation' },
  { unit: 'DHT', activity: 'Shutdown', score: 3, observation_count: 12, sif_precursor_count: 6, top_failed_barrier: 'Depressurization Proof', common_iogp_rule: 'Energy Isolation' },
  { unit: 'DHT', activity: 'Maintenance', score: 4, observation_count: 24, sif_precursor_count: 14, top_failed_barrier: 'Double Block & Bleed', common_iogp_rule: 'Energy Isolation' },
  { unit: 'DHT', activity: 'Line Breaking', score: 5, observation_count: 31, sif_precursor_count: 19, top_failed_barrier: 'Zero Energy Verification', common_iogp_rule: 'Energy Isolation' },
  { unit: 'DHT', activity: 'Hot Work', score: 2, observation_count: 10, sif_precursor_count: 3, top_failed_barrier: 'Fire Blanket Protection', common_iogp_rule: 'Hot Work' },
  { unit: 'DHT', activity: 'Confined Space Entry', score: 4, observation_count: 9, sif_precursor_count: 5, top_failed_barrier: 'Nitrogen Umbilical Redundancy', common_iogp_rule: 'Confined Space' },
  { unit: 'DHT', activity: 'Lifting', score: 1, observation_count: 5, sif_precursor_count: 0, top_failed_barrier: 'Tag Line Control', common_iogp_rule: 'Lifting Operations' },
  { unit: 'DHT', activity: 'Routine Operations', score: 1, observation_count: 6, sif_precursor_count: 0, top_failed_barrier: 'PPE Compliance', common_iogp_rule: 'Line of Fire' },

  // FCC
  { unit: 'FCC', activity: 'Startup', score: 3, observation_count: 10, sif_precursor_count: 4, top_failed_barrier: 'Slide Valve Calibration', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'FCC', activity: 'Shutdown', score: 3, observation_count: 11, sif_precursor_count: 5, top_failed_barrier: 'Purge Nitrogen Verification', common_iogp_rule: 'Energy Isolation' },
  { unit: 'FCC', activity: 'Maintenance', score: 4, observation_count: 22, sif_precursor_count: 12, top_failed_barrier: 'Coupling Lockout', common_iogp_rule: 'Energy Isolation' },
  { unit: 'FCC', activity: 'Line Breaking', score: 4, observation_count: 19, sif_precursor_count: 10, top_failed_barrier: 'Spectacle Blind Swung', common_iogp_rule: 'Energy Isolation' },
  { unit: 'FCC', activity: 'Hot Work', score: 5, observation_count: 18, sif_precursor_count: 11, top_failed_barrier: 'Continuous Gas Monitoring', common_iogp_rule: 'Hot Work' },
  { unit: 'FCC', activity: 'Confined Space Entry', score: 3, observation_count: 6, sif_precursor_count: 2, top_failed_barrier: 'Ventilation Blower', common_iogp_rule: 'Confined Space' },
  { unit: 'FCC', activity: 'Lifting', score: 2, observation_count: 5, sif_precursor_count: 1, top_failed_barrier: 'Overhead Crane Radius', common_iogp_rule: 'Lifting Operations' },
  { unit: 'FCC', activity: 'Routine Operations', score: 1, observation_count: 3, sif_precursor_count: 0, top_failed_barrier: 'Safety Glasses', common_iogp_rule: 'Line of Fire' },

  // SRU
  { unit: 'SRU', activity: 'Startup', score: 3, observation_count: 9, sif_precursor_count: 4, top_failed_barrier: 'Acid Gas Burner Purge', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'SRU', activity: 'Shutdown', score: 3, observation_count: 8, sif_precursor_count: 3, top_failed_barrier: 'Sulfur Sweeping Proof', common_iogp_rule: 'Energy Isolation' },
  { unit: 'SRU', activity: 'Maintenance', score: 4, observation_count: 18, sif_precursor_count: 9, top_failed_barrier: 'Supplied Air (SABA)', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'SRU', activity: 'Line Breaking', score: 4, observation_count: 16, sif_precursor_count: 9, top_failed_barrier: 'Toxic Gas Testing', common_iogp_rule: 'Energy Isolation' },
  { unit: 'SRU', activity: 'Hot Work', score: 4, observation_count: 12, sif_precursor_count: 7, top_failed_barrier: 'Spark Deflection Curtain', common_iogp_rule: 'Hot Work' },
  { unit: 'SRU', activity: 'Confined Space Entry', score: 4, observation_count: 7, sif_precursor_count: 4, top_failed_barrier: 'H2S Continuous Sniffer', common_iogp_rule: 'Confined Space' },
  { unit: 'SRU', activity: 'Lifting', score: 1, observation_count: 4, sif_precursor_count: 1, top_failed_barrier: 'Rigging Inspection', common_iogp_rule: 'Lifting Operations' },
  { unit: 'SRU', activity: 'Routine Operations', score: 2, observation_count: 3, sif_precursor_count: 0, top_failed_barrier: 'Escape Hood Presence', common_iogp_rule: 'Line of Fire' },

  // CDU
  { unit: 'CDU', activity: 'Startup', score: 2, observation_count: 7, sif_precursor_count: 2, top_failed_barrier: 'Water Drainage Check', common_iogp_rule: 'Energy Isolation' },
  { unit: 'CDU', activity: 'Shutdown', score: 3, observation_count: 9, sif_precursor_count: 4, top_failed_barrier: 'Furnace Steam Out', common_iogp_rule: 'Energy Isolation' },
  { unit: 'CDU', activity: 'Maintenance', score: 3, observation_count: 19, sif_precursor_count: 8, top_failed_barrier: 'Electrical Grounding Bus', common_iogp_rule: 'Energy Isolation' },
  { unit: 'CDU', activity: 'Line Breaking', score: 4, observation_count: 17, sif_precursor_count: 10, top_failed_barrier: 'Strainer Interlock Proof', common_iogp_rule: 'Energy Isolation' },
  { unit: 'CDU', activity: 'Hot Work', score: 3, observation_count: 10, sif_precursor_count: 5, top_failed_barrier: 'LEL Detector Calibration', common_iogp_rule: 'Hot Work' },
  { unit: 'CDU', activity: 'Confined Space Entry', score: 3, observation_count: 4, sif_precursor_count: 2, top_failed_barrier: 'Tower Column Blind Spades', common_iogp_rule: 'Confined Space' },
  { unit: 'CDU', activity: 'Lifting', score: 2, observation_count: 4, sif_precursor_count: 2, top_failed_barrier: 'Bund Wall Slinger Path', common_iogp_rule: 'Lifting Operations' },
  { unit: 'CDU', activity: 'Routine Operations', score: 1, observation_count: 2, sif_precursor_count: 1, top_failed_barrier: 'Sampling Glove Box', common_iogp_rule: 'Line of Fire' },

  // Tank Farm
  { unit: 'Tank Farm', activity: 'Startup', score: 2, observation_count: 6, sif_precursor_count: 2, top_failed_barrier: 'Overfill High Alarm Check', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'Tank Farm', activity: 'Shutdown', score: 2, observation_count: 7, sif_precursor_count: 3, top_failed_barrier: 'Sump Isolation', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Tank Farm', activity: 'Maintenance', score: 3, observation_count: 17, sif_precursor_count: 8, top_failed_barrier: 'Pump Coupling Lockout', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Tank Farm', activity: 'Line Breaking', score: 3, observation_count: 14, sif_precursor_count: 6, top_failed_barrier: 'Spade Blind Inserted', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Tank Farm', activity: 'Hot Work', score: 3, observation_count: 10, sif_precursor_count: 4, top_failed_barrier: 'Fire Foam Tender Standby', common_iogp_rule: 'Hot Work' },
  { unit: 'Tank Farm', activity: 'Confined Space Entry', score: 5, observation_count: 11, sif_precursor_count: 9, top_failed_barrier: 'Live Transfer Prohibition', common_iogp_rule: 'Confined Space' },
  { unit: 'Tank Farm', activity: 'Lifting', score: 2, observation_count: 4, sif_precursor_count: 1, top_failed_barrier: 'Floating Roof Crane Jib', common_iogp_rule: 'Lifting Operations' },
  { unit: 'Tank Farm', activity: 'Routine Operations', score: 1, observation_count: 3, sif_precursor_count: 1, top_failed_barrier: 'Dike Walkway Clearance', common_iogp_rule: 'Driving' },

  // Hydrocracker
  { unit: 'Hydrocracker', activity: 'Startup', score: 4, observation_count: 8, sif_precursor_count: 5, top_failed_barrier: 'SIL-3 Interlock Bypass Cleared', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'Hydrocracker', activity: 'Shutdown', score: 3, observation_count: 7, sif_precursor_count: 3, top_failed_barrier: 'Hydrogen Depressuring Rate', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Hydrocracker', activity: 'Maintenance', score: 4, observation_count: 14, sif_precursor_count: 8, top_failed_barrier: 'High Pressure Blind Torque', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Hydrocracker', activity: 'Line Breaking', score: 4, observation_count: 12, sif_precursor_count: 6, top_failed_barrier: 'Helium Leak Proof Test', common_iogp_rule: 'Energy Isolation' },
  { unit: 'Hydrocracker', activity: 'Hot Work', score: 2, observation_count: 5, sif_precursor_count: 2, top_failed_barrier: 'Enclosure Positive Pressure', common_iogp_rule: 'Hot Work' },
  { unit: 'Hydrocracker', activity: 'Confined Space Entry', score: 2, observation_count: 4, sif_precursor_count: 1, top_failed_barrier: 'Inert Gas Purge Proof', common_iogp_rule: 'Confined Space' },
  { unit: 'Hydrocracker', activity: 'Lifting', score: 1, observation_count: 3, sif_precursor_count: 0, top_failed_barrier: 'Reactor Head Rigging', common_iogp_rule: 'Lifting Operations' },
  { unit: 'Hydrocracker', activity: 'Routine Operations', score: 1, observation_count: 2, sif_precursor_count: 1, top_failed_barrier: 'Acoustic Leak Camera', common_iogp_rule: 'Line of Fire' },

  // VDU
  { unit: 'VDU', activity: 'Startup', score: 2, observation_count: 5, sif_precursor_count: 2, top_failed_barrier: 'Ejector Steam Bleed', common_iogp_rule: 'Energy Isolation' },
  { unit: 'VDU', activity: 'Shutdown', score: 2, observation_count: 5, sif_precursor_count: 2, top_failed_barrier: 'Vacuum Break Valve Check', common_iogp_rule: 'Energy Isolation' },
  { unit: 'VDU', activity: 'Maintenance', score: 3, observation_count: 11, sif_precursor_count: 5, top_failed_barrier: 'Furnace Tube Isolation', common_iogp_rule: 'Energy Isolation' },
  { unit: 'VDU', activity: 'Line Breaking', score: 3, observation_count: 9, sif_precursor_count: 4, top_failed_barrier: 'Hot Bitumen Flush Drain', common_iogp_rule: 'Energy Isolation' },
  { unit: 'VDU', activity: 'Hot Work', score: 3, observation_count: 6, sif_precursor_count: 3, top_failed_barrier: 'Burner Box Slag Sheet', common_iogp_rule: 'Hot Work' },
  { unit: 'VDU', activity: 'Confined Space Entry', score: 2, observation_count: 3, sif_precursor_count: 1, top_failed_barrier: 'Column Internal Tray Ladder', common_iogp_rule: 'Confined Space' },
  { unit: 'VDU', activity: 'Lifting', score: 3, observation_count: 3, sif_precursor_count: 2, top_failed_barrier: 'Crane Outrigger Spreader', common_iogp_rule: 'Lifting Operations' },
  { unit: 'VDU', activity: 'Routine Operations', score: 4, observation_count: 2, sif_precursor_count: 2, top_failed_barrier: 'Toe-board / Drop Netting', common_iogp_rule: 'Working at Height' },

  // NHT
  { unit: 'NHT', activity: 'Startup', score: 2, observation_count: 4, sif_precursor_count: 1, top_failed_barrier: 'Nitrogen De-oxygenation', common_iogp_rule: 'Bypassing Safety Controls' },
  { unit: 'NHT', activity: 'Shutdown', score: 2, observation_count: 4, sif_precursor_count: 2, top_failed_barrier: 'Naphtha Liquid Trap Drain', common_iogp_rule: 'Energy Isolation' },
  { unit: 'NHT', activity: 'Maintenance', score: 3, observation_count: 8, sif_precursor_count: 4, top_failed_barrier: 'Pump Casing Vent Lock', common_iogp_rule: 'Energy Isolation' },
  { unit: 'NHT', activity: 'Line Breaking', score: 4, observation_count: 9, sif_precursor_count: 5, top_failed_barrier: 'Dual Block Valve Sealing', common_iogp_rule: 'Energy Isolation' },
  { unit: 'NHT', activity: 'Hot Work', score: 2, observation_count: 3, sif_precursor_count: 1, top_failed_barrier: 'Continuous LEL Sniffing', common_iogp_rule: 'Hot Work' },
  { unit: 'NHT', activity: 'Confined Space Entry', score: 2, observation_count: 2, sif_precursor_count: 1, top_failed_barrier: 'Drum Oxygen Index', common_iogp_rule: 'Confined Space' },
  { unit: 'NHT', activity: 'Lifting', score: 1, observation_count: 2, sif_precursor_count: 1, top_failed_barrier: 'Sling Angle Verification', common_iogp_rule: 'Lifting Operations' },
  { unit: 'NHT', activity: 'Routine Operations', score: 1, observation_count: 1, sif_precursor_count: 1, top_failed_barrier: 'Chemical Splash Goggles', common_iogp_rule: 'Line of Fire' }
];

// IOGP Life-Saving Rules Summary Data (Requirement 5 & 16)
export const MOCK_IOGP_RULES: LifeSavingRuleSummary[] = [
  { rule: 'Energy Isolation', flagged_count: 73, percentage: 27.9, trend: '+14% vs last mo', top_unit: 'DHT', primary_failure: 'Incomplete isolation verification & single block valves' },
  { rule: 'Line of Fire', flagged_count: 50, percentage: 19.1, trend: '+8% vs last mo', top_unit: 'FCC', primary_failure: 'Personnel within high-pressure spray/drop radius' },
  { rule: 'Confined Space', flagged_count: 42, percentage: 16.0, trend: '+11% vs last mo', top_unit: 'Tank Farm', primary_failure: 'Entry during transfer operations & air supply failures' },
  { rule: 'Hot Work', flagged_count: 37, percentage: 14.1, trend: '-4% vs last mo', top_unit: 'FCC', primary_failure: 'Continuous gas monitoring omitted & fire watch absent' },
  { rule: 'Working at Height', flagged_count: 26, percentage: 9.9, trend: '+3% vs last mo', top_unit: 'VDU', primary_failure: 'Missing scaffold toe-boards & dropped object barriers' },
  { rule: 'Bypassing Safety Controls', flagged_count: 21, percentage: 8.0, trend: '+18% vs last mo', top_unit: 'Hydrocracker', primary_failure: 'SIL-3 trip interlocks overridden without active MOC' },
  { rule: 'Driving', flagged_count: 7, percentage: 2.7, trend: '-10% vs last mo', top_unit: 'Tank Farm', primary_failure: 'Heavy truck speed inside battery limits' },
  { rule: 'Lifting Operations', flagged_count: 6, percentage: 2.3, trend: '0% vs last mo', top_unit: 'CDU', primary_failure: 'Rigging tag lines omitted under crane swing' }
];

// Corrective Actions (Requirement 18)
export const MOCK_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    action_id: 'ACT-20260911-0042',
    report_id: 'REF-20260911-000124',
    description: 'Restore positive isolation and verify DBB arrangement before resuming line-breaking activity on P-204 spool.',
    priority: 'CRITICAL',
    owner: 'Mechanical Maintenance Lead',
    unit: 'DHT',
    due_date: '2026-09-12',
    status: 'OPEN',
    notes: 'Mechanical team standing down pending spool blind verification.'
  },
  {
    action_id: 'ACT-20260911-0043',
    report_id: 'REF-20260911-000124',
    description: 'Unclog and inspect all high-temperature bleeders across DHT feed pumps and recertify zero-energy protocol.',
    priority: 'HIGH',
    owner: 'Reliability Inspection Team',
    unit: 'DHT',
    due_date: '2026-09-15',
    status: 'IN PROGRESS'
  },
  {
    action_id: 'ACT-20260910-0038',
    report_id: 'REF-20260910-000889',
    description: 'Revoke hot work permit HW-FCC-419 and conduct safety stand-down with refractory welding contractor.',
    priority: 'CRITICAL',
    owner: 'HSSE Field Safety Specialist',
    unit: 'FCC',
    due_date: '2026-09-11',
    status: 'CLOSED',
    notes: 'Stand-down completed with 34 welders and supervisors.'
  },
  {
    action_id: 'ACT-20260909-0012',
    report_id: 'REF-20260909-000732',
    description: 'Pack and clamp leaking valve packing on E-302 manifold and restrict SRU grade 3 access.',
    priority: 'CRITICAL',
    owner: 'SRU Area Operations Lead',
    unit: 'SRU',
    due_date: '2026-09-10',
    status: 'CLOSED',
    notes: 'Enclosure clamp fitted and air testing confirms 0 ppm at joint perimeter.'
  },
  {
    action_id: 'ACT-20260908-0029',
    report_id: 'REF-20260908-000620',
    description: 'Audit all active DCS bypass keys across Hydrocracker complex and reinstate SIL-3 trip trip logic.',
    priority: 'CRITICAL',
    owner: 'Process Automation Manager',
    unit: 'Hydrocracker',
    due_date: '2026-09-09',
    status: 'CLOSED',
    notes: 'Physical keys logged in shift safe; all trips returned to active armed state.'
  },
  {
    action_id: 'ACT-20260907-0018',
    report_id: 'REF-20260907-000491',
    description: 'Install positive mechanical padlocks on TK-401 stair access gate interlocked with pipeline valve position switches.',
    priority: 'HIGH',
    owner: 'Offsites Asset Engineer',
    unit: 'Tank Farm',
    due_date: '2026-09-14',
    status: 'AWAITING VERIFICATION',
    notes: 'Padlocks installed; waiting for safety engineer physical field sign-off.'
  },
  {
    action_id: 'ACT-20260906-0005',
    report_id: 'REF-20260906-000311',
    description: 'Mandate live-line tester prove-test-prove workflow sign-off on CDU electrical isolations.',
    priority: 'CRITICAL',
    owner: 'Chief Electrical Engineer',
    unit: 'CDU',
    due_date: '2026-09-08',
    status: 'CLOSED',
    notes: 'Toolbox talk completed for all substation electrical shifts.'
  },
  {
    action_id: 'ACT-20260905-0011',
    report_id: 'REF-20260905-000194',
    description: 'Tag out scaffold VDU-SC-204 and install 100% fine mesh netting around burner deck perimeter.',
    priority: 'HIGH',
    owner: 'Scaffold Safety Coordinator',
    unit: 'VDU',
    due_date: '2026-09-06',
    status: 'CLOSED'
  },
  {
    action_id: 'ACT-20260904-0003',
    report_id: 'REF-20260904-000088',
    description: 'Replace seized drain valve on V-101 gauge column and conduct plant-wide audit of level gauge isolations.',
    priority: 'CRITICAL',
    owner: 'Piping & Valve Reliability Lead',
    unit: 'NHT',
    due_date: '2026-09-07',
    status: 'CLOSED'
  },
  {
    action_id: 'ACT-20260903-0017',
    report_id: 'REF-20260903-000951',
    description: 'Recertify all nitrogen life-support consoles and replace kink-prone flexible umbilicals with reinforced braided lines.',
    priority: 'CRITICAL',
    owner: 'Refinery HSSE Director',
    unit: 'DHT',
    due_date: '2026-09-04',
    status: 'CLOSED'
  },
  {
    action_id: 'ACT-20260829-0021',
    report_id: 'REF-20260829-000551',
    description: 'Implement mandatory physical try-step test witnessed by operations before coupling guard removal across all pump skids.',
    priority: 'CRITICAL',
    owner: 'Refinery Machinery Manager',
    unit: 'Tank Farm',
    due_date: '2026-09-01',
    status: 'CLOSED'
  },
  {
    action_id: 'ACT-20260825-0009',
    report_id: 'REF-20260911-000124',
    description: 'Conduct comprehensive double block and bleed training refresh for all mechanical contract supervisors.',
    priority: 'MEDIUM',
    owner: 'HSSE Training Department',
    unit: 'DHT',
    due_date: '2026-09-20',
    status: 'IN PROGRESS'
  },
  {
    action_id: 'ACT-20260820-0015',
    report_id: 'REF-20260910-000889',
    description: 'Install fixed optical flame & gas sensors on upper catalyst slide valve structure elevation +22m.',
    priority: 'HIGH',
    owner: 'Instrumentation Project Group',
    unit: 'FCC',
    due_date: '2026-09-10',
    status: 'OVERDUE',
    notes: 'Parts shipment delayed from supplier; escalation notice sent to plant manager.'
  }
];

// Notifications (Requirement 23)
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    type: 'CRITICAL',
    title: 'DHT — Energy isolation barrier failure detected',
    message: 'REF-20260911-000124 flagged on Feed Pump P-204 suction line breaking. Immediate supervisor stop recommended.',
    timestamp: '12m ago',
    read: false,
    report_id: 'REF-20260911-000124',
    action_id: 'ACT-20260911-0042'
  },
  {
    id: 'NOTIF-002',
    type: 'HIGH',
    title: 'FCC — Hot work observation with missing gas-test verification',
    message: 'Regenerator slide valve cutting torch ignited with unverified flammable gas monitoring.',
    timestamp: '2h ago',
    read: false,
    report_id: 'REF-20260910-000889'
  },
  {
    id: 'NOTIF-003',
    type: 'ACTION DUE',
    title: 'FCC — Corrective action overdue on slide valve sensors',
    message: 'ACT-20260820-0015 is 6 days overdue. Lead Instrument Engineer notified.',
    timestamp: '4h ago',
    read: false,
    action_id: 'ACT-20260820-0015'
  },
  {
    id: 'NOTIF-004',
    type: 'SYSTEM',
    title: 'Daily safety analytics processed',
    message: '30-day SIF precursor density analysis recalculated across all 8 processing units.',
    timestamp: '6h ago',
    read: true
  }
];

// Time-series trend analytics data (Requirement 17)
export const MOCK_ANALYTICS_DATA = {
  trends30d: [
    { date: 'Aug 17', total_obs: 12, sif_precursors: 8, barrier_failures: 4, open_actions: 9, critical_failures: 2 },
    { date: 'Aug 20', total_obs: 15, sif_precursors: 9, barrier_failures: 5, open_actions: 10, critical_failures: 3 },
    { date: 'Aug 23', total_obs: 14, sif_precursors: 8, barrier_failures: 3, open_actions: 11, critical_failures: 2 },
    { date: 'Aug 26', total_obs: 18, sif_precursors: 11, barrier_failures: 6, open_actions: 13, critical_failures: 4 },
    { date: 'Aug 29', total_obs: 16, sif_precursors: 10, barrier_failures: 5, open_actions: 12, critical_failures: 3 },
    { date: 'Sep 01', total_obs: 21, sif_precursors: 14, barrier_failures: 8, open_actions: 14, critical_failures: 5 },
    { date: 'Sep 04', total_obs: 19, sif_precursors: 12, barrier_failures: 7, open_actions: 15, critical_failures: 4 },
    { date: 'Sep 07', total_obs: 23, sif_precursors: 16, barrier_failures: 9, open_actions: 13, critical_failures: 6 },
    { date: 'Sep 10', total_obs: 25, sif_precursors: 18, barrier_failures: 11, open_actions: 11, critical_failures: 7 },
    { date: 'Sep 13', total_obs: 22, sif_precursors: 15, barrier_failures: 8, open_actions: 11, critical_failures: 5 },
    { date: 'Sep 16', total_obs: 20, sif_precursors: 13, barrier_failures: 7, open_actions: 11, critical_failures: 4 }
  ],
  activityDistribution: [
    { activity: 'Line Breaking', sif_count: 78, total_obs: 112, barrier_rate: '69.6%' },
    { activity: 'Maintenance', sif_count: 64, total_obs: 120, barrier_rate: '53.3%' },
    { activity: 'Hot Work', sif_count: 42, total_obs: 68, barrier_rate: '61.7%' },
    { activity: 'Confined Space', sif_count: 36, total_obs: 48, barrier_rate: '75.0%' },
    { activity: 'Startup', sif_count: 22, total_obs: 44, barrier_rate: '50.0%' },
    { activity: 'Shutdown', sif_count: 18, total_obs: 38, barrier_rate: '47.3%' },
    { activity: 'Lifting', sif_count: 10, total_obs: 26, barrier_rate: '38.4%' },
    { activity: 'Routine Ops', sif_count: 6, total_obs: 32, barrier_rate: '18.7%' }
  ],
  closureTrend: [
    { month: 'May 2026', created: 34, closed: 36, closure_rate: 105 },
    { month: 'Jun 2026', created: 42, closed: 40, closure_rate: 95 },
    { month: 'Jul 2026', created: 51, closed: 48, closure_rate: 94 },
    { month: 'Aug 2026', created: 63, closed: 58, closure_rate: 92 },
    { month: 'Sep 2026', created: 48, closed: 44, closure_rate: 91 }
  ]
};

// Global KPIs (Requirement 3)
export const MOCK_GLOBAL_KPIS = {
  totalReports: 412,
  timeWindow: '30d',
  sifPotentialCount: 262,
  sifPotentialPercent: 63.6,
  openCriticalControlFailures: 11,
  controlFailuresSubtitle: 'Awaiting barrier restoration',
  topAtRiskUnit: 'DHT' as RefineryUnit,
  topAtRiskPrecursors: 50,
  
  // Secondary KPIs
  highRiskObservations: 142,
  criticalBarrierFailures: 68,
  nearMisses: 89,
  correctiveActionsOverdue: 3,
  energyIsolationFailures: 73,
  confinedSpacePrecursors: 42,
  hotWorkPrecursors: 37,
  lineBreakingObservations: 112
};

/**
 * Nav-Drishti Process Safety Platform - Backend Server
 * Uses Node 22 built-in SQLite (DatabaseSync) for local real database storage.
 * Provides REST API for Role-Based Login, 10-Parameter Refinery Observations,
 * Interactive Message Exchange, and AI Clarification Auto-Ask.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Initialization
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'refinery_safety.db');
const db = new DatabaseSync(dbPath);

console.log(`[SQLITE] Connected to database at: ${dbPath}`);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    badge_id TEXT,
    name TEXT,
    role TEXT,
    title TEXT,
    unit TEXT,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS reports (
    report_id TEXT PRIMARY KEY,
    timestamp TEXT,
    unit TEXT,
    equipment TEXT,
    equipment_full TEXT,
    activity TEXT,
    report_type TEXT,
    raw_narrative TEXT,
    ai_summary TEXT,
    severity TEXT,
    sif_potential INTEGER,
    sif_score REAL,
    sif_classification TEXT,
    iogp_rule TEXT,
    parameters_json TEXT,
    created_by TEXT,
    created_by_name TEXT,
    reporter_role TEXT,
    status TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS report_messages (
    id TEXT PRIMARY KEY,
    report_id TEXT,
    sender_id TEXT,
    sender_name TEXT,
    sender_role TEXT,
    message TEXT,
    timestamp TEXT,
    is_ai INTEGER,
    auto_updated_fields_json TEXT
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    title TEXT,
    message TEXT,
    timestamp TEXT,
    read INTEGER,
    report_id TEXT
  );

  CREATE TABLE IF NOT EXISTS corrective_actions (
    action_id TEXT PRIMARY KEY,
    report_id TEXT,
    description TEXT,
    priority TEXT,
    owner TEXT,
    unit TEXT,
    due_date TEXT,
    status TEXT,
    notes TEXT
  );
`);

// Seed Default Users if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const seedUsers = [
    {
      id: 'USR-WORKER-01',
      badge_id: 'OP-4492',
      name: 'Rajesh Kumar',
      role: 'field_worker',
      title: 'Senior Mechanical Technician',
      unit: 'DHT',
      email: 'rajesh.kumar@refinery.internal'
    },
    {
      id: 'USR-INSPECTOR-01',
      badge_id: 'HSSE-108',
      name: 'Vikram Singh',
      role: 'safety_inspector',
      title: 'Senior HSSE Process Safety Inspector',
      unit: 'Refinery Complex Wide',
      email: 'vikram.singh@refinery.internal'
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, badge_id, name, role, title, unit, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of seedUsers) {
    insertUser.run(u.id, u.badge_id, u.name, u.role, u.title, u.unit, u.email);
  }
  console.log('[SQLITE] Seeded initial demo users');
}

// Seed Demo Reports if empty
const reportCount = db.prepare('SELECT COUNT(*) as count FROM reports').get().count;
if (reportCount === 0) {
  const seedReports = [
    {
      report_id: 'REF-20260918-004412',
      timestamp: '2026-09-18 14:22 UTC',
      unit: 'DHT',
      equipment: 'P-204',
      equipment_full: 'DIESEL FEED PUMP P-204 SUCTION SPOOL',
      activity: 'Line Breaking',
      report_type: 'SIF Precursor',
      raw_narrative: 'Maintenance crew began loosening flange bolts on pump P-204 suction line before positive physical isolation was established. Bleed valve passed 24 bar residual diesel fuel. Workers stepped back when spray mist occurred. No injury, but potential flash fire in high-pressure zone.',
      ai_summary: 'Line breaking initiated on live 24 bar diesel line at P-204 suction without verified zero energy. High-potential SIF precursor with immediate fatality risk.',
      severity: 'CRITICAL',
      sif_potential: 1,
      sif_score: 4.8,
      sif_classification: 'IMMINENT SIF POTENTIAL',
      iogp_rule: 'Energy Isolation',
      parameters_json: JSON.stringify({
        refinery_unit: 'Diesel Hydrotreater (DHT)',
        process_area: 'Feed Section',
        equipment: 'Pump',
        specific_location: 'Feed Line Flange P-204 Suction',
        activity_type: 'Line Breaking',
        task: 'Flange unbolting for strainer cleaning',
        operating_condition: 'Maintenance',
        routine_status: 'Non-routine',
        safety_critical_task: true,
        ua_uc_type: 'Unsafe Act (UA)',
        ua_uc_category: 'Isolation/LOTO violation',
        ua_uc_subcategory: 'Unbolting pressurized line before zero-energy verification',
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
        fatality_pathway: 'Pressurized diesel line → unverified isolation → flange opened → hydrocarbon spray → workers in line of fire → potential flash fire / fatal burns',
        immediate_action: 'Work Stopped',
        work_stopped: true,
        equipment_isolated: true,
        supervisor_notified: true,
        observation_status: 'Under Investigation'
      }),
      created_by: 'USR-WORKER-01',
      created_by_name: 'Rajesh Kumar',
      reporter_role: 'Senior Mechanical Technician',
      status: 'Under Investigation',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      report_id: 'REF-20260919-009182',
      timestamp: '2026-09-19 09:15 UTC',
      unit: 'FCC',
      equipment: 'E-102',
      equipment_full: 'MAIN FRACTIONATOR OVERHEAD CONDENSER E-102',
      activity: 'Hot Work',
      report_type: 'Near Miss',
      raw_narrative: 'Contractor welder struck arc on condenser support platform while open sewer drain within 8 meters was unblanked and missing fire blanket seal. LEL meter alarmed at 8% lower explosive limit. Work halted immediately.',
      ai_summary: 'Hot work ignition source within 8m of unblanked oily sewer drain. Critical safety control violation under IOGP Hot Work standards.',
      severity: 'HIGH',
      sif_potential: 1,
      sif_score: 4.2,
      sif_classification: 'HIGH SIF POTENTIAL',
      iogp_rule: 'Hot Work',
      parameters_json: JSON.stringify({
        refinery_unit: 'Fluid Catalytic Cracking Unit (FCC)',
        process_area: 'Fractionation Section',
        equipment: 'Heat Exchanger',
        specific_location: 'Overhead Platform E-102',
        activity_type: 'Hot Work',
        task: 'Structural bracket welding',
        operating_condition: 'Normal Operation',
        routine_status: 'Routine',
        safety_critical_task: true,
        ua_uc_type: 'Unsafe Act (UA)',
        ua_uc_category: 'Hot-work violation',
        ua_uc_subcategory: 'Welding near open drain without spark containment',
        process_hazard: 'Flammable Atmosphere',
        hazard_mechanism: 'Fire',
        process_material: 'Naphtha / Hydrocarbon Vapor',
        energy_source: 'Thermal',
        pressure_condition: 'Atmospheric',
        temperature_condition: 'Ambient',
        persons_exposed: 3,
        exposure_type: 'Fire Exposure',
        exposure_duration: '5–30 minutes',
        barrier_type: 'Permit to Work',
        barrier_status: 'Degraded',
        critical_control_failure: true,
        performance_influencing_factor: 'Inadequate Planning',
        communication_issue: false,
        supervision_issue: true,
        actual_consequence: 'No Injury',
        potential_consequence: 'Major Fire',
        high_potential_event: true,
        sif_potential: true,
        sif_mechanism: 'Hydrocarbon Fire',
        proximity_to_harm: 4,
        fatality_pathway: 'Vapor from sewer drain → hot work spark → ignition → flash fire on structure → personnel trapped on platform',
        immediate_action: 'Work Stopped',
        work_stopped: true,
        equipment_isolated: false,
        supervisor_notified: true,
        observation_status: 'Corrective Action Assigned'
      }),
      created_by: 'USR-WORKER-01',
      created_by_name: 'Rajesh Kumar',
      reporter_role: 'Senior Mechanical Technician',
      status: 'Corrective Action Assigned',
      created_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  const insertReport = db.prepare(`
    INSERT INTO reports (
      report_id, timestamp, unit, equipment, equipment_full, activity,
      report_type, raw_narrative, ai_summary, severity, sif_potential,
      sif_score, sif_classification, iogp_rule, parameters_json,
      created_by, created_by_name, reporter_role, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of seedReports) {
    insertReport.run(
      r.report_id, r.timestamp, r.unit, r.equipment, r.equipment_full, r.activity,
      r.report_type, r.raw_narrative, r.ai_summary, r.severity, r.sif_potential,
      r.sif_score, r.sif_classification, r.iogp_rule, r.parameters_json,
      r.created_by, r.created_by_name, r.reporter_role, r.status, r.created_at
    );
  }

  // Seed sample messages for first report
  const insertMessage = db.prepare(`
    INSERT INTO report_messages (
      id, report_id, sender_id, sender_name, sender_role, message, timestamp, is_ai, auto_updated_fields_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMessage.run(
    'MSG-001',
    'REF-20260918-004412',
    'AI-SYSTEM',
    'Nav-Drishti AI Co-Pilot',
    'ai_copilot',
    '🤖 AI Observation Ingested: High SIF Potential detected (4.8/5.0). Automated parameter scan flagged high-pressure diesel release during line breaking. Critical control: Energy Isolation (LOTO) missing.',
    '2026-09-18 14:23 UTC',
    1,
    null
  );

  insertMessage.run(
    'MSG-002',
    'REF-20260918-004412',
    'AI-SYSTEM',
    'Nav-Drishti AI Co-Pilot',
    'ai_copilot',
    '⚠️ Parameter Clarification: Rajesh, was the upstream block valve locked with a physical padlock, and was any depressurization gauge monitored before unbolting?',
    '2026-09-18 14:24 UTC',
    1,
    null
  );

  insertMessage.run(
    'MSG-003',
    'REF-20260918-004412',
    'USR-WORKER-01',
    'Rajesh Kumar',
    'field_worker',
    'Block valve had a danger tag but no padlock. We cracked flange bolts when gauge showed 0, but the needle gauge was seized and line actually held 24 bar residual gas oil.',
    '2026-09-18 14:35 UTC',
    0,
    null
  );

  insertMessage.run(
    'MSG-004',
    'REF-20260918-004412',
    'USR-INSPECTOR-01',
    'Vikram Singh (Safety Inspector)',
    'safety_inspector',
    'Thanks Rajesh. Immediate Stop Work confirmed on P-204 spool. Unit Supervisor has been instructed to swing a spectacle blind spade and replace defective pressure gauge PG-204B before permit reissue.',
    '2026-09-18 14:48 UTC',
    0,
    null
  );

  // Seed initial alerts
  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, user_id, type, title, message, timestamp, read, report_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAlert.run(
    'ALT-001',
    'USR-WORKER-01',
    'CRITICAL',
    'Safety Officer Reply on REF-20260918-004412',
    'Vikram Singh issued Stop Work Authority confirmation and corrective isolation instructions for P-204.',
    '1 hour ago',
    0,
    'REF-20260918-004412'
  );

  console.log('[SQLITE] Seeded demo reports, messages, and alerts');
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    database: 'SQLite 3 (Built-in Node 22)',
    database_file: dbPath,
    timestamp: new Date().toISOString()
  });
});

// Auth / Login
app.post('/api/auth/login', (req, res) => {
  const { role, badge_id, name } = req.body;

  let user;
  if (role) {
    user = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get(role);
  } else if (badge_id) {
    user = db.prepare('SELECT * FROM users WHERE badge_id = ? LIMIT 1').get(badge_id);
  }

  if (!user) {
    // Create guest profile if custom
    const newId = `USR-${Date.now()}`;
    const newRole = role || 'field_worker';
    const newName = name || (newRole === 'field_worker' ? 'Field Operator' : 'Safety Inspector');
    const newBadge = badge_id || (newRole === 'field_worker' ? 'OP-7001' : 'HSSE-3001');

    db.prepare(`
      INSERT INTO users (id, badge_id, name, role, title, unit, email)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newId,
      newBadge,
      newName,
      newRole,
      newRole === 'field_worker' ? 'Mechanical Operations Specialist' : 'Process Safety Compliance Lead',
      'Refinery Area 01',
      `${newName.toLowerCase().replace(/\s+/g, '.')}@refinery.internal`
    );

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(newId);
  }

  res.json({ success: true, user });
});

// Get Users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// Get Reports (Role-aware: field workers see their own or relevant unit reports, inspectors see all)
app.get('/api/reports', (req, res) => {
  const { role, user_id } = req.query;

  let query = 'SELECT * FROM reports ORDER BY created_at DESC';
  let reports;

  if (role === 'field_worker' && user_id) {
    // Field worker sees reports they submitted or active reports
    reports = db.prepare('SELECT * FROM reports WHERE created_by = ? ORDER BY created_at DESC').all(user_id);
    if (reports.length === 0) {
      // Fallback to all reports so demo is rich
      reports = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
    }
  } else {
    reports = db.prepare(query).all();
  }

  // Parse parameters_json
  const formatted = reports.map(r => ({
    ...r,
    sif_potential: Boolean(r.sif_potential),
    parameters: r.parameters_json ? JSON.parse(r.parameters_json) : {}
  }));

  res.json(formatted);
});

// Get Single Report
app.get('/api/reports/:id', (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json({
    ...report,
    sif_potential: Boolean(report.sif_potential),
    parameters: report.parameters_json ? JSON.parse(report.parameters_json) : {}
  });
});

// Create New Report (With 10-Parameter Extraction & AI Auto-Ask trigger)
app.post('/api/reports', (req, res) => {
  try {
    const data = req.body;
    const reportId = data.report_id || `REF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = data.timestamp || new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO reports (
        report_id, timestamp, unit, equipment, equipment_full, activity,
        report_type, raw_narrative, ai_summary, severity, sif_potential,
        sif_score, sif_classification, iogp_rule, parameters_json,
        created_by, created_by_name, reporter_role, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      reportId,
      timestamp,
      data.unit || 'DHT',
      data.equipment || 'P-204',
      data.equipment_full || `${data.unit} Equipment`,
      data.activity || 'Maintenance',
      data.report_type || 'UA',
      data.raw_narrative || '',
      data.ai_summary || data.raw_narrative?.slice(0, 150) || 'Field observation logged',
      data.severity || 'HIGH',
      data.sif_potential ? 1 : 0,
      Number(data.sif_score || 3.5),
      data.sif_classification || 'ELEVATED RISK',
      data.iogp_rule || 'Energy Isolation',
      JSON.stringify(data.parameters || {}),
      data.created_by || 'USR-WORKER-01',
      data.created_by_name || 'Rajesh Kumar',
      data.reporter_role || 'Field Worker',
      data.status || 'Under Investigation',
      new Date().toISOString()
    );

    // AI Auto-Clarification check on missing parameters
    const params = data.parameters || {};
    const missing = [];
    if (!params.actual_consequence || params.actual_consequence === 'Unknown') missing.push('actual injury or consequence');
    if (!params.pressure_condition || params.pressure_condition === 'Unknown') missing.push('pressure condition');
    if (!params.process_material) missing.push('hazardous chemical material');
    if (!params.barrier_status || params.barrier_status === 'Unknown') missing.push('barrier or LOTO verification');
    if (params.persons_exposed === undefined || params.persons_exposed === null) missing.push('number of workers in line of fire');

    // Create Initial AI Welcome Message
    const msgId = `MSG-${Date.now()}`;
    let aiPrompt = `🤖 AI Observation Ingested: Report ${reportId} recorded in SQLite database.`;
    if (missing.length > 0) {
      aiPrompt += `\n\n🔍 AI Parameter Clarification Needed:\nTo complete the 10-parameter Process Safety taxonomy, could you clarify: ${missing.slice(0, 3).join(', ')}? You can reply directly in this chat!`;
    }

    db.prepare(`
      INSERT INTO report_messages (
        id, report_id, sender_id, sender_name, sender_role, message, timestamp, is_ai, auto_updated_fields_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      msgId,
      reportId,
      'AI-SYSTEM',
      'Nav-Drishti AI Co-Pilot',
      'ai_copilot',
      aiPrompt,
      'Just now',
      1,
      JSON.stringify({ missing_parameters: missing })
    );

    // Create alert for safety inspector
    db.prepare(`
      INSERT INTO alerts (id, user_id, type, title, message, timestamp, read, report_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `ALT-${Date.now()}`,
      'ALL',
      data.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      `New Observation Reported: ${reportId} (${data.unit})`,
      `${data.created_by_name || 'Worker'} submitted: "${data.raw_narrative?.slice(0, 90)}..."`,
      'Just now',
      0,
      reportId
    );

    const created = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(reportId);
    res.status(201).json({
      success: true,
      report: {
        ...created,
        sif_potential: Boolean(created.sif_potential),
        parameters: created.parameters_json ? JSON.parse(created.parameters_json) : {}
      }
    });
  } catch (err) {
    console.error('[API] Error creating report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Report Status / Severity / Parameters
app.patch('/api/reports/:id', (req, res) => {
  try {
    const reportId = req.params.id;
    const existing = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(reportId);
    if (!existing) return res.status(404).json({ error: 'Report not found' });

    const updates = req.body;
    let parameters = existing.parameters_json ? JSON.parse(existing.parameters_json) : {};
    if (updates.parameters) {
      parameters = { ...parameters, ...updates.parameters };
    }

    const newStatus = updates.status || existing.status;
    const newSeverity = updates.severity || existing.severity;
    const newSifScore = updates.sif_score !== undefined ? updates.sif_score : existing.sif_score;
    const newSifClassification = updates.sif_classification || existing.sif_classification;

    db.prepare(`
      UPDATE reports
      SET status = ?, severity = ?, sif_score = ?, sif_classification = ?, parameters_json = ?
      WHERE report_id = ?
    `).run(
      newStatus,
      newSeverity,
      newSifScore,
      newSifClassification,
      JSON.stringify(parameters),
      reportId
    );

    // If inspector changed status, alert worker
    if (updates.status && updates.updated_by_role === 'safety_inspector') {
      db.prepare(`
        INSERT INTO alerts (id, user_id, type, title, message, timestamp, read, report_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `ALT-${Date.now()}`,
        existing.created_by,
        'SYSTEM',
        `Observation Status Updated: ${reportId}`,
        `Safety Inspector changed status to: ${newStatus}`,
        'Just now',
        0,
        reportId
      );
    }

    const updated = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(reportId);
    res.json({
      success: true,
      report: {
        ...updated,
        sif_potential: Boolean(updated.sif_potential),
        parameters: updated.parameters_json ? JSON.parse(updated.parameters_json) : {}
      }
    });
  } catch (err) {
    console.error('[API] Error updating report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Messages for a Report
app.get('/api/reports/:id/messages', (req, res) => {
  const messages = db.prepare(`
    SELECT * FROM report_messages WHERE report_id = ? ORDER BY rowid ASC
  `).all(req.params.id);

  const formatted = messages.map(m => ({
    ...m,
    is_ai: Boolean(m.is_ai),
    auto_updated_fields: m.auto_updated_fields_json ? JSON.parse(m.auto_updated_fields_json) : null
  }));

  res.json(formatted);
});

// Post Message to Report & AI Auto-Update Parameters
app.post('/api/reports/:id/messages', (req, res) => {
  try {
    const reportId = req.params.id;
    const { sender_id, sender_name, sender_role, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const report = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    let autoUpdated = {};
    const lower = message.toLowerCase();

    // Natural language parameter detection
    let params = report.parameters_json ? JSON.parse(report.parameters_json) : {};

    if (lower.includes('no injury') || lower.includes('no one hurt')) {
      params.actual_consequence = 'No Injury';
      autoUpdated.actual_consequence = 'No Injury';
    } else if (lower.includes('first aid')) {
      params.actual_consequence = 'First Aid';
      autoUpdated.actual_consequence = 'First Aid';
    } else if (lower.includes('medical') || lower.includes('hospital')) {
      params.actual_consequence = 'Medical Treatment';
      autoUpdated.actual_consequence = 'Medical Treatment';
    }

    if (lower.includes('high pressure') || lower.includes('24 bar') || lower.includes('bar pressure') || lower.includes('pressurized')) {
      params.pressure_condition = 'High Pressure (2–50 bar)';
      autoUpdated.pressure_condition = 'High Pressure (2–50 bar)';
    } else if (lower.includes('low pressure') || lower.includes('atmospheric')) {
      params.pressure_condition = 'Atmospheric';
      autoUpdated.pressure_condition = 'Atmospheric';
    }

    if (lower.includes('diesel')) {
      params.process_material = 'Diesel';
      autoUpdated.process_material = 'Diesel';
    } else if (lower.includes('sour gas') || lower.includes('h2s')) {
      params.process_material = 'Sour Gas';
      params.process_hazard = 'Toxic Hydrocarbon / H2S';
      autoUpdated.process_material = 'Sour Gas';
    } else if (lower.includes('naphtha')) {
      params.process_material = 'Naphtha';
      autoUpdated.process_material = 'Naphtha';
    }

    if (lower.includes('loto failed') || lower.includes('no padlock') || lower.includes('not isolated') || lower.includes('unverified')) {
      params.barrier_status = 'Failed';
      params.critical_control_failure = true;
      autoUpdated.barrier_status = 'Failed';
    } else if (lower.includes('isolated') && lower.includes('verified')) {
      params.barrier_status = 'Effective';
      autoUpdated.barrier_status = 'Effective';
    }

    // Insert Worker/Inspector Message
    const msgId = `MSG-${Date.now()}`;
    db.prepare(`
      INSERT INTO report_messages (
        id, report_id, sender_id, sender_name, sender_role, message, timestamp, is_ai, auto_updated_fields_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      msgId,
      reportId,
      sender_id || 'USR-ANONYMOUS',
      sender_name || 'Refinery User',
      sender_role || 'field_worker',
      message,
      'Just now',
      0,
      Object.keys(autoUpdated).length > 0 ? JSON.stringify(autoUpdated) : null
    );

    // If parameters were extracted, update the report record
    if (Object.keys(autoUpdated).length > 0) {
      db.prepare(`
        UPDATE reports SET parameters_json = ? WHERE report_id = ?
      `).run(JSON.stringify(params), reportId);

      // AI acknowledges the parameter update
      const aiReplyId = `MSG-${Date.now() + 1}`;
      const fieldsText = Object.entries(autoUpdated).map(([k, v]) => `• ${k} ➔ "${v}"`).join('\n');
      const aiReply = `🤖 AI Parameter Update: Extracted verified parameters from your response:\n${fieldsText}\nDataset schema synchronized in SQLite database.`;

      db.prepare(`
        INSERT INTO report_messages (
          id, report_id, sender_id, sender_name, sender_role, message, timestamp, is_ai, auto_updated_fields_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        aiReplyId,
        reportId,
        'AI-SYSTEM',
        'Nav-Drishti AI Co-Pilot',
        'ai_copilot',
        aiReply,
        'Just now',
        1,
        JSON.stringify(autoUpdated)
      );
    }

    // Trigger Notification for the other party
    if (sender_role === 'field_worker') {
      db.prepare(`
        INSERT INTO alerts (id, user_id, type, title, message, timestamp, read, report_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `ALT-${Date.now() + 2}`,
        'ALL',
        'HIGH',
        `Worker Reply on ${reportId}`,
        `${sender_name}: "${message.slice(0, 80)}"`,
        'Just now',
        0,
        reportId
      );
    } else if (sender_role === 'safety_inspector') {
      db.prepare(`
        INSERT INTO alerts (id, user_id, type, title, message, timestamp, read, report_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `ALT-${Date.now() + 2}`,
        report.created_by,
        'CRITICAL',
        `Safety Inspector Message on ${reportId}`,
        `${sender_name}: "${message.slice(0, 80)}"`,
        'Just now',
        0,
        reportId
      );
    }

    const allMessages = db.prepare(`
      SELECT * FROM report_messages WHERE report_id = ? ORDER BY rowid ASC
    `).all(reportId);

    res.json({
      success: true,
      auto_updated: autoUpdated,
      messages: allMessages.map(m => ({
        ...m,
        is_ai: Boolean(m.is_ai),
        auto_updated_fields: m.auto_updated_fields_json ? JSON.parse(m.auto_updated_fields_json) : null
      }))
    });
  } catch (err) {
    console.error('[API] Error posting message:', err);
    res.status(500).json({ error: err.message });
  }
});

// Trigger AI Clarification explicitly
app.post('/api/reports/:id/ai-clarify', (req, res) => {
  try {
    const reportId = req.params.id;
    const report = db.prepare('SELECT * FROM reports WHERE report_id = ?').get(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const params = report.parameters_json ? JSON.parse(report.parameters_json) : {};
    const questions = [];

    if (!params.pressure_condition) {
      questions.push('What was the approximate line pressure during the activity? (e.g. Atmospheric, Low Pressure <2 bar, High Pressure 2–50 bar)');
    }
    if (!params.barrier_status || params.barrier_status === 'Unknown') {
      questions.push('Was the process isolation (Double block and bleed / LOTO) physically verified before line breaking?');
    }
    if (!params.actual_consequence) {
      questions.push('Was there any actual personnel injury (No Injury, First Aid, or Medical)?');
    }
    if (!params.process_material) {
      questions.push('What specific process hydrocarbon or stream was present? (Diesel, Sour Gas, Crude, Naphtha)');
    }

    const promptText = questions.length > 0
      ? `🤖 AI Safety Co-Pilot: To finalize the 10-parameter audit trail, please answer the following:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '🤖 AI Safety Co-Pilot: All 10 parameters are fully populated and verified for SIF modeling!';

    const msgId = `MSG-${Date.now()}`;
    db.prepare(`
      INSERT INTO report_messages (
        id, report_id, sender_id, sender_name, sender_role, message, timestamp, is_ai, auto_updated_fields_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      msgId,
      reportId,
      'AI-SYSTEM',
      'Nav-Drishti AI Co-Pilot',
      'ai_copilot',
      promptText,
      'Just now',
      1,
      JSON.stringify({ questions })
    );

    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Alerts
app.get('/api/alerts', (req, res) => {
  const { user_id, role } = req.query;
  let alerts;

  if (role === 'field_worker' && user_id) {
    alerts = db.prepare(`
      SELECT * FROM alerts WHERE user_id = ? OR user_id = 'ALL' ORDER BY rowid DESC LIMIT 30
    `).all(user_id);
  } else {
    alerts = db.prepare('SELECT * FROM alerts ORDER BY rowid DESC LIMIT 30').all();
  }

  res.json(alerts.map(a => ({ ...a, read: Boolean(a.read) })));
});

// Mark Alert Read
app.patch('/api/alerts/:id/read', (req, res) => {
  db.prepare('UPDATE alerts SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Mark All Alerts Read
app.post('/api/alerts/mark-all-read', (req, res) => {
  db.prepare('UPDATE alerts SET read = 1').run();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  NAV-DRISHTI REFINERY SAFETY BACKEND SERVER       `);
  console.log(`  Running on: http://localhost:${PORT}              `);
  console.log(`  Database:   ${dbPath} (SQLite 3)                 `);
  console.log(`====================================================`);
});

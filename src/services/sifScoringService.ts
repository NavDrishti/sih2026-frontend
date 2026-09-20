import { SIFParameterBreakdown } from '../types/safety';

export interface SIFScoringWeights {
  energyReleasePotential: number;
  barrierFailure: number;
  workerExposure: number;
  hazardousMaterial: number;
  lineBreaking: number;
  controlVerification: number;
  proximityToHazard: number;
}

// Configurable weights vector summing to 1.0
export const DEFAULT_SIF_WEIGHTS: SIFScoringWeights = {
  barrierFailure: 0.25,        // Most critical safety precursor: barrier status
  energyReleasePotential: 0.20,// Kinetic/thermal/pressure potential
  hazardousMaterial: 0.15,     // H2S, toxic, volatile hydrocarbon
  workerExposure: 0.15,        // Direct line of fire / physical exposure
  controlVerification: 0.10,   // Proof of zero energy / DBB
  lineBreaking: 0.10,          // Intrusion into containment
  proximityToHazard: 0.05      // Physical distance
};

export type SIFClassification = 
  | 'IMMINENT SIF POTENTIAL'
  | 'HIGH SIF POTENTIAL'
  | 'ELEVATED RISK'
  | 'CONTROLLED';

export interface SIFCalculationResult {
  score: number; // 0.0 to 5.0 rounded to 1 decimal
  classification: SIFClassification;
  colorHex: string;
  isSIFPrecursor: boolean;
  weightsUsed: SIFScoringWeights;
}

/**
 * Decoupled SIF Precursor Calculation Engine
 * Computes weighted sum of 7 safety parameters.
 */
export function calculateSIFScore(
  params: SIFParameterBreakdown,
  weights: SIFScoringWeights = DEFAULT_SIF_WEIGHTS
): SIFCalculationResult {
  const rawScore = 
    params.barrierFailure * weights.barrierFailure +
    params.energyReleasePotential * weights.energyReleasePotential +
    params.hazardousMaterial * weights.hazardousMaterial +
    params.workerExposure * weights.workerExposure +
    params.controlVerification * weights.controlVerification +
    params.lineBreaking * weights.lineBreaking +
    params.proximityToHazard * weights.proximityToHazard;

  // Round to 1 decimal place
  const score = Math.round(rawScore * 10) / 10;

  let classification: SIFClassification = 'CONTROLLED';
  let colorHex = '#10b981'; // Green/verified
  let isSIFPrecursor = false;

  if (score >= 4.5 || (params.barrierFailure >= 4 && params.energyReleasePotential >= 4)) {
    classification = 'IMMINENT SIF POTENTIAL';
    colorHex = '#ef4444'; // Red
    isSIFPrecursor = true;
  } else if (score >= 3.8) {
    classification = 'HIGH SIF POTENTIAL';
    colorHex = '#f87171'; // Light red/high amber
    isSIFPrecursor = true;
  } else if (score >= 2.8) {
    classification = 'ELEVATED RISK';
    colorHex = '#f59e0b'; // Amber
    isSIFPrecursor = score >= 3.2;
  } else {
    classification = 'CONTROLLED';
    colorHex = '#06b6d4'; // Cyan
    isSIFPrecursor = false;
  }

  return {
    score,
    classification,
    colorHex,
    isSIFPrecursor,
    weightsUsed: weights
  };
}

/**
 * Generates rule-based / AI explainability reasons for why a report was flagged.
 */
export function generateSIFExplanations(
  params: SIFParameterBreakdown,
  hazards: string[],
  activity: string
): { whyFlagged: string[]; primaryEscalationTrigger: string } {
  const whyFlagged: string[] = [];

  if (params.energyReleasePotential >= 4) {
    whyFlagged.push('High-energy pressurized system / stored energy present');
  }
  if (params.barrierFailure >= 4) {
    whyFlagged.push('Positive isolation / barrier integrity failure detected');
  }
  if (params.workerExposure >= 4) {
    whyFlagged.push('Worker physically positioned directly in line of fire / exposure plane');
  }
  if (params.hazardousMaterial >= 4) {
    whyFlagged.push(`Hazardous material severity class elevated (${hazards.join(', ') || 'Toxic/Flammable'})`);
  }
  if (params.lineBreaking >= 4 || activity.toLowerCase().includes('line breaking')) {
    whyFlagged.push('Line-breaking activity breaching primary containment boundary');
  }
  if (params.controlVerification >= 4) {
    whyFlagged.push('Zero-energy proof or dual verification documentation absent');
  }
  if (params.proximityToHazard >= 4) {
    whyFlagged.push('Immediate proximity (<1m) to high-consequence failure point');
  }

  // Primary escalation trigger synthesis
  let primaryEscalationTrigger = 'Multiple elevated risk factors across active containment';
  if (params.barrierFailure >= 4 && params.lineBreaking >= 4) {
    primaryEscalationTrigger = 'Barrier failure during line breaking involving pressurized hydrocarbon or hazardous medium.';
  } else if (params.barrierFailure >= 4) {
    primaryEscalationTrigger = 'Primary engineered safety barrier failed or bypassed under operational pressure.';
  } else if (params.energyReleasePotential >= 4 && params.workerExposure >= 4) {
    primaryEscalationTrigger = 'Unmitigated energy release potential with direct personnel exposure path.';
  }

  return { whyFlagged, primaryEscalationTrigger };
}

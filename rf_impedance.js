/**
 * RF Transmission Line Input Impedance Calculator
 * Calculates input impedance using transmission line theory
 * mu_r is 1.
 * Velocity Factor (VF) = 1 / √(εr)
 * εr = relative permittivity)
 */

class RFTransmissionLine {
  /**
   * Calculate input impedance of a transmission line
   * @param {number} Z0 - Characteristic impedance (ohms)
   * @param {number} ZL_real - Load impedance real part (ohms)
   * @param {number} ZL_imag - Load impedance imaginary part (ohms)
   * @param {number} frequency - Frequency (Hz)
   * @param {number} length - Line length (meters)
   * @param {number} vf - Velocity factor (default 1.0 for free space)
   * @returns {object} Input impedance {real, imag}
   */
  static calculateInputImpedance(Z0, ZL_real, ZL_imag, frequency, length, vf = 1.0) {
    const c = 3e8; // Speed of light (m/s)=2.998e8
    const wavelength = (c * vf) / frequency;
    const beta = (2 * Math.PI) / wavelength; // Phase constant
    const electricalLength = beta * length; // In radians

    // Calculate tan(beta*l)
    const tanBL = Math.tan(electricalLength);

    // Complex impedance calculation
    // Zin = Z0 * (ZL + j*Z0*tan(beta*l)) / (Z0 + j*ZL*tan(beta*l))

    // Numerator: ZL + j*Z0*tan(beta*l)
    const num_real = ZL_real;
    const num_imag = ZL_imag + Z0 * tanBL;

    // Denominator: Z0 + j*ZL*tan(beta*l)
    const den_real = Z0;
    const den_imag = (ZL_real * tanBL) + (ZL_imag * tanBL);

    // Complex division: (num_real + j*num_imag) / (den_real + j*den_imag)
    const den_mag_sq = den_real ** 2 + den_imag ** 2;
    const div_real = (num_real * den_real + num_imag * den_imag) / den_mag_sq;
    const div_imag = (num_imag * den_real - num_real * den_imag) / den_mag_sq;

    // Multiply by Z0
    const Zin_real = Z0 * div_real;
    const Zin_imag = Z0 * div_imag;

    return {
      real: Zin_real,
      imag: Zin_imag,
      magnitude: Math.sqrt(Zin_real ** 2 + Zin_imag ** 2),
      phase: Math.atan2(Zin_imag, Zin_real) * (180 / Math.PI) // degrees
    };
  }

  /**
   * Calculate VSWR (Voltage Standing Wave Ratio)
   * @param {number} Z0 - Characteristic impedance
   * @param {number} ZL_real - Load impedance real part
   * @param {number} ZL_imag - Load impedance imaginary part
   * @returns {number} VSWR
   */
  static calculateVSWR(Z0, ZL_real, ZL_imag) {
    // Reflection coefficient: Γ = (ZL - Z0) / (ZL + Z0)
    const num_real = ZL_real - Z0;
    const num_imag = ZL_imag;
    const den_real = ZL_real + Z0;
    const den_imag = ZL_imag;

    const den_mag_sq = den_real ** 2 + den_imag ** 2;
    const gamma_real = (num_real * den_real + num_imag * den_imag) / den_mag_sq;
    const gamma_imag = (num_imag * den_real - num_real * den_imag) / den_mag_sq;
    const gamma_mag = Math.sqrt(gamma_real ** 2 + gamma_imag ** 2);

    // VSWR = (1 + |Γ|) / (1 - |Γ|)
    return (1 + gamma_mag) / (1 - gamma_mag);
  }

  /**
   * Calculate reflection coefficient
   * @param {number} Z0 - Characteristic impedance
   * @param {number} ZL_real - Load impedance real part
   * @param {number} ZL_imag - Load impedance imaginary part
   * @returns {object} Reflection coefficient {real, imag, magnitude, phase}
   */
  static calculateReflectionCoefficient(Z0, ZL_real, ZL_imag) {
    const num_real = ZL_real - Z0;
    const num_imag = ZL_imag;
    const den_real = ZL_real + Z0;
    const den_imag = ZL_imag;

    const den_mag_sq = den_real ** 2 + den_imag ** 2;
    const gamma_real = (num_real * den_real + num_imag * den_imag) / den_mag_sq;
    const gamma_imag = (num_imag * den_real - num_real * den_imag) / den_mag_sq;

    return {
      real: gamma_real,
      imag: gamma_imag,
      magnitude: Math.sqrt(gamma_real ** 2 + gamma_imag ** 2),
      phase: Math.atan2(gamma_imag, gamma_real) * (180 / Math.PI)
    };
  }
}

// Example Usage
console.log("=== RF Transmission Line Input Impedance Calculator ===\n");

// Example 1: 50Ω line, 75Ω load at 1 GHz
const ex1 = RFTransmissionLine.calculateInputImpedance(
  50,      // Z0 = 50Ω
  75,      // ZL = 75Ω (real part)
  0,       // ZL imaginary = 0Ω (purely resistive)
  1e9,     // Frequency = 1 GHz
  0.05,    // Length = 5 cm
  0.66     // Velocity factor = 0.66 (typical coax)
);

console.log("Example 1: 50Ω line, 75Ω resistive load at 1 GHz, 5cm length");
console.log(`Input Impedance: ${ex1.real.toFixed(2)} + j${ex1.imag.toFixed(2)} Ω`);
console.log(`Magnitude: ${ex1.magnitude.toFixed(2)} Ω, Phase: ${ex1.phase.toFixed(2)}°`);
console.log(`VSWR: ${RFTransmissionLine.calculateVSWR(50, 75, 0).toFixed(2)}\n`);

// Example 2: Complex load impedance
const ex2 = RFTransmissionLine.calculateInputImpedance(
  50,      // Z0 = 50Ω
  30,      // ZL real = 30Ω
  20,      // ZL imag = j20Ω
  2e9,     // Frequency = 2 GHz
  0.02,    // Length = 2 cm
  0.66
);

console.log("Example 2: 50Ω line, complex load (30 + j20)Ω at 2 GHz, 2cm length");
console.log(`Input Impedance: ${ex2.real.toFixed(2)} + j${ex2.imag.toFixed(2)} Ω`);
console.log(`Magnitude: ${ex2.magnitude.toFixed(2)} Ω, Phase: ${ex2.phase.toFixed(2)}°`);
const gamma2 = RFTransmissionLine.calculateReflectionCoefficient(50, 30, 20);
console.log(`Reflection Coefficient: ${gamma2.magnitude.toFixed(3)} ∠${gamma2.phase.toFixed(2)}°`);
console.log(`VSWR: ${RFTransmissionLine.calculateVSWR(50, 30, 20).toFixed(2)}\n`);

// Example 3: Quarter-wave transformer
const ex3 = RFTransmissionLine.calculateInputImpedance(
  50,      // Z0 = 50Ω
  100,     // ZL real = 100Ω
  0,       // ZL imag = 0Ω
  1e9,    // Frequency = 1 GHz
  0.075,   // Quarter wavelength at 1 GHz with vf=0.66
  0.66
);

console.log("Example 3: Quarter-wave line (50Ω impedance transformer)");
console.log(`Input Impedance: ${ex3.real.toFixed(2)} + j${ex3.imag.toFixed(2)} Ω`);
console.log(`Should be close to 25Ω for ideal case\n`);

module.exports = RFTransmissionLine;

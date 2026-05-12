class inputZ {
  /**
   * Calculate input impedance for parallel branches:
   * - Branch 1: Transmission line with short circuit (ZL = 0)
   * - Branch 2: Transmission line with complex load (ZL_real + j*ZL_imag)
   * 
   * Velocity Factor (VF) = 1 / √(εr)=1
   * 
   * @param {number} Z01 - Characteristic impedance of transmission line 1 (ohms)
   * @param {number} Z02 - Characteristic impedance of transmission line 2 (ohms)
   * @param {number} length1(m) - Length of branch 1 (short circuit branch) (meters)
   * @param {number} length2(m) - Length of branch 2 (complex load branch) (meters)
   * @param {number} ZL2_real - Load impedance real part of branch 2 (ohms)
   * @param {number} ZL2_imag - Load impedance imaginary part of branch 2 (ohms)
   * @param {number} frequency - Frequency (Hz)
   * @param {number} vf - Velocity factor (default 1.0 for free space)
   * @returns {object} Input impedance {real, imag, magnitude, phase}
   */
  static parallelBranchesImpedance(
      Z01,Z02, 
      length1, length2, 
      ZL2_real, ZL2_imag, 
      frequency, vf = 1.0) {
        frequency= frequency*1.0e6;
        const c = 3e8; // Speed of light (m/s)
        const wavelength = (c * vf) / frequency;
        // const beta = (2 * Math.PI) / wavelength; // Phase constant
        const beta= (2*Math.PI*frequency)/(c*vf);//vf=1
        // ===== BRANCH 1: Short circuit (ZL = 0) =====
        const electricalLength1 = beta * length1;
        const tanBL1 = Math.tan(electricalLength1);
    
    // For short circuit (ZL = 0):
    // Zin1 = Z01 * (0 + j*Z01*tan(beta*l)) / (Z01 + j*0*tan(beta*l))
    // Zin1 = Z01 * (j*Z01*tan(beta*l)) / Z01
    // Zin1 = j*Z01*tan(beta*l) (purely imaginary)
    const Zin1_real = 0;
    const Zin1_imag = Z01 * tanBL1;

    // ===== BRANCH 2: Complex load =====
    const electricalLength2 = beta * length2;
    const tanBL2 = Math.tan(electricalLength2);

    // Zin2 = Z02 * (ZL2 + j*Z02*tan(beta*l)) / (Z02 + j*ZL2*tan(beta*l))
    
    // Numerator: Z02(ZL2_real+jZL2_imag) + j*Z02*Z02*tanBL2
    const num2_real = ZL2_real;//*Z02
    const num2_imag = ZL2_imag + Z02 * tanBL2;//*Z02

    // Denominator: Z02 + j*ZL2*tan(beta*l)=Z02+j(ZL2_real+jZL2_img)tan(beta*l)=
    // Z02+jZL2_real*tan(beta*l)-ZL2_img*tan(beta*l)
    const den2_real = Z02 - ZL2_imag * tanBL2; 
    const den2_imag = ZL2_real * tanBL2; 

    // Complex division:Zin2= Z02*(num2_real + j*num2_imag) / (den2_real + j*den2_imag)
    const den2_mag_sq = den2_real ** 2 + den2_imag ** 2;
    //Zin2=(num2_real+jnum2_imag)*(den2_real-jden2_imag)/den2_mag_sq
    const div2_real = (num2_real * den2_real + num2_imag * den2_imag) / den2_mag_sq;
    const div2_imag = (num2_imag * den2_real - num2_real * den2_imag) / den2_mag_sq;

    // Multiply by Z02: characteristic R of line2
    const Zin2_real = Z02 * div2_real;
    const Zin2_imag = Z02 * div2_imag;

    // ===== PARALLEL COMBINATION =====
    //  1/Z_parallel=1/Zin1+1/Zin2; 1/Z_parallel= Zin1+Zin2/Zin1*Zin2;
    // For parallel impedances: Z_parallel = (Z1 * Z2) / (Z1 + Z2)
    //=(jZin1_imag)(Zin2_real+jZin2_imag)/(Zin2_real+j(Zin1_imag+Zin2_imag))
    
    // Numerator: Z1 * Z2
    const num_parallel_real = Zin1_real * Zin2_real - Zin1_imag * Zin2_imag;
    const num_parallel_imag = Zin1_real * Zin2_imag + Zin1_imag * Zin2_real;

    // Denominator: Z1 + Z2
    const den_parallel_real = Zin1_real + Zin2_real;
    const den_parallel_imag = Zin1_imag + Zin2_imag;

    // Complex division
    const den_parallel_mag_sq = den_parallel_real ** 2 + den_parallel_imag ** 2;
    const Zin_real = (num_parallel_real * den_parallel_real + num_parallel_imag * den_parallel_imag) / den_parallel_mag_sq;
    const Zin_imag = (num_parallel_imag * den_parallel_real - num_parallel_real * den_parallel_imag) / den_parallel_mag_sq;

    console.log('== Parallel Transmission Line Impedance ==\n');

console.log('Configuration:');
// console.log(`  Generator Impedance (Z0): ${Z0} Ω`);
console.log(`  Frequency: ${(frequency / 1e9).toFixed(2)} GHz`);
console.log(`  Velocity Factor: ${vf}\n`);

console.log('Branch 1 (Short Circuit):');
console.log(` characteristic Impedance : ${Z01}`);
console.log(` Length: ${(length1).toFixed(4)} m`);
console.log(` Zin1 =  j${Zin1_imag.toFixed(3)} Ω`);
console.log('Branch 2 (Complex Load):');
console.log(` characteristic Impedance : ${Z02}`);
console.log(`  Length: ${(length2).toFixed(4)} m`);
console.log(`  Load: ZL2 = ${ZL2_real} + j${ZL2_imag} Ω`);
console.log(`  Zin2 = ${Zin2_real.toFixed(3)} + j${Zin2_imag.toFixed(3)} Ω\n`);
console.log('Result - Parallel Combination:');
console.log(`  Zin (parallel) = ${Zin_real.toFixed(3)} + j${Zin_imag.toFixed(3)} Ω`);
const Zin_parallel_magnitude = Math.sqrt(Zin_real ** 2 + Zin_imag ** 2);
const Zin_parallel_phase = Math.atan2(Zin_imag, Zin_real) * (180 / Math.PI);
console.log(`  Magnitude: ${Zin_parallel_magnitude.toFixed(3)} Ω`);
// console.log(`  Phase: ${result.Zin_parallel.phase.toFixed(3)}°\n`);

// ============= FORMULA EXPLANATION =============
console.log('=== Mathematical Details ===\n');

console.log('Transmission Line Input Impedance Formula:');
console.log('  Zin = Z0 * (ZL + j*Z0*tan(βl)) / (Z0 + j*ZL*tan(βl))');
console.log('  where β = 2π/λ (phase constant)\n');

console.log('For Short Circuit (ZL = 0):');
console.log('  Zin1 = j*Z0*tan(βl)  (purely reactive)\n');

console.log('Parallel Impedance Formula:');
console.log('  Z_parallel = (Z1 * Z2) / (Z1 + Z2)\n');

    return {
      Zin1: { imag: Zin1_imag },
      Zin2: { real: Zin2_real, imag: Zin2_imag },
      Zin_parallel: {
        real: Zin_real,
        imag: Zin_imag
        // magnitude: Math.sqrt(Zin_real ** 2 + Zin_imag ** 2),
        // phase: Math.atan2(Zin_imag, Zin_real) * (180 / Math.PI) // degrees
      }
    };
  }
}
export { inputZ };
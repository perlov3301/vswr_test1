echo "# vswr_test1" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/perlov3301/vswr_test1.git
git push -u origin main

(Z_L = 75 - j25), (Z_0 = 50) vswr=1.77_
zl=9.33-39.2i z0=50 vswr =  8.7250
Z_L = 100 + j25  z0=50 VSWR=2.16
Z₀ = 100 Ω, Zᴸ = 40 + j70 Ω, line length = 0.3λ → VSWR = 3.86 

(function() {
  const originalAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'input') {
      console.log('Input listener attached to:', this);
    }
    return originalAdd.call(this, type, listener, options);
  };
})();

// ============= RESULTS =============
// console.log('== Parallel Transmission Line Impedance ==\n');

// console.log('Configuration:');
// console.log(`  Generator Impedance (Z0): ${Z0} Ω`);
// console.log(`  Frequency: ${(frequency / 1e9).toFixed(2)} GHz`);
// console.log(`  Velocity Factor: ${vf}\n`);

// console.log('Branch 1 (Short Circuit):');
// console.log(` characteristic Impedance : ${Z01}`);
// console.log(` Length: ${(length1 * 1000).toFixed(2)} mm`);
// console.log(` Zin1 =  + j${result.Zin1.imag.toFixed(2)} Ω`);
// console.log(` (Purely imaginary, as expected for short circuit)\n`);

// console.log('Branch 2 (Complex Load):');
// console.log(` characteristic Impedance : ${Z02}`);
// console.log(`  Length: ${(length2 * 1000).toFixed(2)} mm`);
// console.log(`  Load: ZL2 = ${ZL2_real} + j${ZL2_imag} Ω`);
// console.log(`  Zin2 = ${result.Zin2.real.toFixed(2)} + j${result.Zin2.imag.toFixed(2)} Ω\n`);

// console.log('Result - Parallel Combination:');
// console.log(`  Zin (parallel) = ${result.Zin_parallel.real.toFixed(2)} + j${result.Zin_parallel.imag.toFixed(2)} Ω`);
// console.log(`  Magnitude: ${result.Zin_parallel.magnitude.toFixed(2)} Ω`);
// console.log(`  Phase: ${result.Zin_parallel.phase.toFixed(2)}°\n`);

// // ============= FORMULA EXPLANATION =============
// console.log('=== Mathematical Details ===\n');

// console.log('Transmission Line Input Impedance Formula:');
// console.log('  Zin = Z0 * (ZL + j*Z0*tan(βl)) / (Z0 + j*ZL*tan(βl))');
// console.log('  where β = 2π/λ (phase constant)\n');

// console.log('For Short Circuit (ZL = 0):');
// console.log('  Zin1 = j*Z0*tan(βl)  (purely reactive)\n');

// console.log('Parallel Impedance Formula:');
// console.log('  Z_parallel = (Z1 * Z2) / (Z1 + Z2)\n');

// ============= WAVELENGTH INFO =============
// const c = 3e8;
// const wavelength = (c * vf) / frequency;
// const beta = (2 * Math.PI) / wavelength;
// const electricalLength1 = beta * length1 * (180 / Math.PI);
// const electricalLength2 = beta * length2 * (180 / Math.PI);
// console.log('=== Wavelength Information ===\n');
// console.log(`  Wavelength (λ): ${(wavelength * 100).toFixed(3)} cm`);
// console.log(`  Branch 1 electrical length: ${electricalLength1.toFixed(3)}°`);
// console.log(`  Branch 2 electrical length: ${electricalLength2.toFixed(3)}°\n`);

# Parallel Transmission Line Input Impedance Calculator

## Overview
This calculates the input impedance for a configuration with two transmission line branches connected in parallel:
- **Branch 1**: Transmission line terminated with a **short circuit** (ZL = 0 Ω)
- **Branch 2**: Transmission line terminated with a **complex load** (ZL = R + jX)

## Physical Setup

```
                Branch 1 (Short Circuit)
    ╔═════════════════════════════════════╗
    ║                                     ║
Input ┃─────► TLine (length1, Z0) ──────► ║ (Short: ZL=0)
Point ║                                    ║
    ║                                     ║
    ╚═════════════════════════════════════╝
         ║
    ┌────┴────┐
    │          │
    │ Parallel │
    │          │
    └────┬────┘
         ║
    ╔════╩════════════════════════════════╗
    ║                                     ║
    ║─────► TLine (length2, Z0) ──────► (Complex Load)
    ║                                  ZL = R + jX
    ╚═════════════════════════════════════╝
         Branch 2 (Complex Load)
```

## Mathematical Theory

### Single Transmission Line Input Impedance
For a transmission line with characteristic impedance Z₀, length l, terminated with load ZL:

$$Z_{in} = Z_0 \frac{Z_L + jZ_0\tan(\beta l)}{Z_0 + jZ_L\tan(\beta l)}$$

Where:
- **β** = 2π/λ (phase constant in rad/m)
- **λ** = c·VF/f (wavelength)
- **c** = 3×10⁸ m/s (speed of light)
- **VF** = velocity factor (1.0 for free space, <1 for dielectrics)
- **f** = frequency (Hz)

### Branch 1: Short Circuit Branch
When ZL = 0 (short circuit):

$$Z_{in1} = jZ_0\tan(\beta l_1)$$

This is **purely reactive** (imaginary). It acts as:
- **Inductive** when tan(βl₁) > 0
- **Capacitive** when tan(βl₁) < 0

### Branch 2: Complex Load Branch
When ZL = R + jX (complex load):

$$Z_{in2} = Z_0 \frac{(R+jX) + jZ_0\tan(\beta l_2)}{Z_0 + j(R+jX)\tan(\beta l_2)}$$

This is computed as complex division in the code.

### Parallel Combination
Two impedances in parallel:

$$Z_{in,parallel} = \frac{Z_{in1} \times Z_{in2}}{Z_{in1} + Z_{in2}}$$

## Usage Example

```javascript
const result = inputZ.calculateParallelBranchesImpedance(
  50,                    // Z0: characteristic impedance (Ω)
  0.05,                  // length1: branch 1 length (m)
  0.10,                  // length2: branch 2 length (m)
  75,                    // ZL2_real: load resistance (Ω)
  25,                    // ZL2_imag: load reactance (Ω)
  2.4e9,                 // frequency: 2.4 GHz
  1.0                    // velocity factor (default)
);

// Access results
console.log(result.Zin1.real, result.Zin1.imag);           // Branch 1 impedance
console.log(result.Zin2.real, result.Zin2.imag);           // Branch 2 impedance
console.log(result.Zin_parallel.real, result.Zin_parallel.imag);  // Final impedance
console.log(result.Zin_parallel.magnitude);                 // Magnitude in ohms
console.log(result.Zin_parallel.phase);                     // Phase in degrees
```

## Return Value Structure

```javascript
{
  Zin1: {
    real: <number>,
    imag: <number>
  },
  Zin2: {
    real: <number>,
    imag: <number>
  },
  Zin_parallel: {
    real: <number>,
    imag: <number>,
    magnitude: <number>,
    phase: <number>  // in degrees
  }
}
```

## Key Parameters Explained

### Characteristic Impedance (Z0)
- Standard coaxial cable: 50 Ω or 75 Ω
- Microstrip: typically 50 Ω
- Stripline: depends on design

### Velocity Factor (VF)
- Free space: VF = 1.0
- Coaxial cable: VF ≈ 0.66 (depends on dielectric)
- Microstrip: VF ≈ 0.6-0.8 (depends on εr)
- Formula: VF = 1/√(εr)

### Electrical Length
- Electrical length (degrees) = (physical length / wavelength) × 360°
- Quarter-wave (λ/4): 90°
- Half-wave (λ/2): 180°

## Physical Insights

1. **Short Circuit Branch**: Creates a reactive element that varies with frequency and length
2. **Complex Load Branch**: Provides resistive and reactive termination
3. **Parallel Combination**: 
   - Short circuit branch dominates at specific frequencies (when it's purely reactive with low impedance)
   - Provides impedance matching opportunities
   - Useful in filter design, matching networks, and broadband circuits

## Design Considerations

- Short circuit branch at λ/4 acts as series capacitor (high impedance)
- Short circuit branch at λ/2 acts as short circuit (low impedance)
- Use for impedance matching, filtering, or circuit tuning
- Frequency-dependent behavior critical for wideband applications

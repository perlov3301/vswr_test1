function calculateVSWR() {
  const z0 = parseFloat(impedanceInput.value);
  const r = parseFloat(loadRInput.value);
  const x = parseFloat(loadXInput.value);

  if (!z0 || Number.isNaN(z0) || Number.isNaN(r) || Number.isNaN(x)) {
    throw new Error(
    "Please enter valid numeric values for impedance and load components.");
  }

  const rl = r;
  const xl = x;
  const zL_real = rl;
  const zL_imag = xl;
  const numeratorReal = zL_real - z0;
  const numeratorImag = zL_imag;
  const denominatorReal = zL_real + z0;
  const denominatorImag = zL_imag;

  const numeratorMag = Math.hypot(numeratorReal, numeratorImag);
  const denominatorMag = Math.hypot(denominatorReal, denominatorImag);
  const gamma = numeratorMag / denominatorMag;
  const vswr = (1 + gamma) / (1 - gamma);

  return {
    gamma: gamma,
    vswr: vswr,
    reflection: gamma,
    
  };
}
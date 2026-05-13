class calculate {
  /**
   @param {number} z0: Generator's characteristic Impedance
   @param {number} {Zin_real, Zin_imag}: Impedance at input of parallel combination
   @returns {object} {gamma, vswr }where gamma is the reflection coefficient magnitude and 
        vswr is the Voltage Standing Wave Ratio 
   gamma= (Zin_real - Z0 + j*Zin_imag) / (Zin_real + Z0 + j*Zin_imag)
   |gamma|= sqrt((Zin_real - Z0)^2 + Zin_imag^2) / sqrt((Zin_real + Z0)^2 + Zin_imag^2)
   VSWR= (1 + |gamma|) / (1 - |gamma|)
   */

  static calculateVSWR(Z0, Zin_real, Zin_imag) {
    if (!Z0 || Number.isNaN(Z0) 
        || Number.isNaN(Zin_real) 
        || Number.isNaN(Zin_imag)) {
    throw new Error(
    "one or more values for impedance or load components are invalid.");
  }
    const ro = Z0;
    const zL_real = Zin_real;
    const zL_imag = Zin_imag;
    const numeratorReal =    zL_real - ro;
    const numeratorImag = zL_imag;
    const denominatorReal =    zL_real + ro;
    const denominatorImag = zL_imag;
   // vswr= (1+|g|)/(1-|g|)
   // g=(zL-ro)/(zL+ro)=(zL_real-ro + j*zL_imag)/(zL_real+ro + j*zL_imag)
   //g=(zL_real-ro+ j*zL_imag)*(zL_real+ro-j*zL_imag)/((zL_real+ro)**2 + zl_imag**2)
  // g_numerator= (zL_real-ro)*(zL_real+ro)+zL_imag*zL_imag+ j*zL_imag*(zL_real+ro-zL_real+ro)
  // g_denominat= (zL_real+ro)**2 + zl_imag**2
 // g_numerator= zL_real**2-ro**2+zL_imag*zL_imag+ j*2*ro*zL_imag
 // g_denominat= (zL_real+ro)**2 + zl_imag**2
 // g_nom_real= zL_real**2- ro**2+ zL_imag**2= zL_real**2+ zL_imag**2- ro**2;
 // g_nom_imag= 2*ro*zL_imag;
 // g_mag= Math.sqrt(g_nom_real**2+ g_nom_imag**2)/g_denominat;
  // the sum of the squares of its arguments 
  // const var1= Math.sqrt(nu)
    const numeratorMag = Math.hypot(numeratorReal, numeratorImag);
    const denominatorMag = Math.hypot(denominatorReal, denominatorImag);
    const gamma = numeratorMag / denominatorMag;
  const vswr = (1 + gamma) / (1 - gamma);
  return {
    gamma: gamma,
    vswr: vswr,
    reflection_module: gamma,
  };
}
}
export {calculate}; 
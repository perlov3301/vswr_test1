document.addEventListener("readystatechange", () => {
    console.log("console; readyState:", document.readyState);
    const v_text = document.getElementById("explanation");
    v_text.value += `Current readyState: ${document.readyState}\n`;
    if (document.readyState==="interactive") {
      console.log("if to console;DOM is interactive");
      v_text.value+= "DOM is interactive\n";
    }
});
const form= document.getElementById("vswrForm");
const generatorR= document.getElementById("generatorR");
const frequencyInput= document.getElementById("frequency");
const line1_R= document.getElementById("line1_R");
const line2_R= document.getElementById("line2_R");
const line1_L= document.getElementById("line1_L");
const line2_L= document.getElementById("line2_L");
const load_real= document.getElementById("load_real");
const load_imag= document.getElementById("load_imag");
const resultDiv= document.getElementById("result");
const explanationArea= document.getElementById("explanation");
const statusIndicator= document.getElementById("statusIndicator");
const textnow=explanationArea.value;
console.log("explanationArea:", textnow);
explanationArea.value+= textnow+ "explanationArea is ready\n";
// statusIndicator.append("  ready");
//  statusIndicator.textContent=" ready";
statusIndicator.replaceChildren("ready");
// const Z0=  parseFloat(generatorR.value);
// const frequency= parseFloat(frequencyInput.value);
// const Z01= parseFloat(line1_R.value);
// const Z02= parseFloat(line2_R.value);
// const length1= parseFloat(line1_L.value);
// const length2= parseFloat(line2_L.value);
// const ZL2_real= parseFloat(load_real.value);
// const ZL2_imag= parseFloat(load_imag.value);
// if (Number.isNaN(Z0) || Number.isNaN(frequency) || 
//     Number.isNaN(Z01) || Number.isNaN(Z02) || 
//     Number.isNaN(length1) || Number.isNaN(length2) || 
//     Number.isNaN(ZL2_real) || Number.isNaN(ZL2_imag) ) {
//     throw new Error( "Please enter valid numeric values for all inputs.");
//   }
let currentState= "ready";
function setState(state) {
  currentState= state;
  const captions= {
    ready: "ready for input",
    modified: "Input changed",
    submitted: "Calculated",
    error: "error",
  };
  statusIndicator.textContent= captions[state] || state;
  statusIndicator.className= `status-indicator ${state}`;
}
function formatNumber(value) {
  return Number.isFinite(value) ? 
      value.toFixed(3): "N/A";
}

// ============= CALCULATION =============
import { inputZ } from './input_z.js';
import { timenow } from './timenow.js';
const vf=1;
// let vf=1;
function updateResult() {
  try {
    const Z0=  parseFloat(generatorR.value);
    const frequency= parseFloat(frequencyInput.value);
    const Z01= parseFloat(line1_R.value);
    const Z02= parseFloat(line2_R.value);
    const length1= parseFloat(line1_L.value);
    const length2= parseFloat(line2_L.value);
    const ZL2_real= parseFloat(load_real.value);
    const ZL2_imag= parseFloat(load_imag.value);
    if (Number.isNaN(Z0) || Number.isNaN(frequency) || 
        Number.isNaN(Z01) || Number.isNaN(Z02) || 
        Number.isNaN(length1) || Number.isNaN(length2) || 
        Number.isNaN(ZL2_real) || Number.isNaN(ZL2_imag) ) {
        throw new Error( "Please enter valid numeric values for all inputs.");
  }
    const data = inputZ.parallelBranchesImpedance(
      Z01,Z02, 
      length1, length2, 
      ZL2_real, ZL2_imag, 
      frequency, vf
     );
     const ZinImag= data.Zin_parallel.imag > 0 ? 
       `+ j${formatNumber(data.Zin_parallel.imag)}` : 
       `- j${formatNumber(-data.Zin_parallel.imag)}`;
  resultDiv.textContent= `Input Impedance: 
      ${formatNumber(data.Zin_parallel.real)} 
      ${ZinImag} Ω` +
      ` magnitude |Zin| = ${formatNumber(data.Zin_parallel.magnitude)} Ω, ` 
      // +`Phase = ${formatNumber(data.Zin_parallel.phase)}°)`
      ;
  explanationArea.value= `Calculated for two parallel branches:\n` +
      `line1: Z01=${Z01} Ω and length=${length1} m\n` +
      `line2: Z02=${Z02}Ω, length=${length2}m; load ZL2=${ZL2_real}+${ZL2_imag}*j Ω\n` +
      `Frequency: ${frequency} MHz\n` +
      `Resulting Zin= ${formatNumber(data.Zin_parallel.real)} ${ZinImag}*j Ω\n` +
      `Magnitude |Zin| = ${formatNumber(data.Zin_parallel.magnitude)} Ω\n`
      // +`Phase = ${formatNumber(data.Zin_parallel.phase)}°`
      ;
  setState("submitted");
  } catch (error) {
    resultDiv.textContent = "Error calculating impedance";
    explanationArea.value = error.message;
    setState("error");
  }
}

function markModified() {
  if (currentState !== "modified") {
    setState("modified");
  } 
}
function markSubmitted() {
  if (currentState == "submitted") {}
    
}

generatorR.addEventListener("input", markModified);
frequencyInput.addEventListener("input", markModified);
line1_R.addEventListener("input", markModified);
line1_L.addEventListener("input", markModified);
line2_R.addEventListener("input", markModified);
line2_L.addEventListener("input", markModified);
load_real.addEventListener("input", markModified);
load_imag.addEventListener("input", markModified);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateResult();
});

setState(`time now: ${timenow()}; ready for input `);
/**
 function calculateVSWR() {
  const Z0= parseFloat(generatorR.value);
  const Z01= parseFloat(line1_R.value);
  const Z02= parseFloat(line2_R.value);
  const length2
  const x= parseFloat(loadXInput.value);

  if (!z0 || Number.isNaN(z0) || Number.isNaN(r) || Number.isNaN(x)) {
    throw new Error("please enter valid numeric values impedance and load components.");
  }
  const rl= r;
  const xl= x;
  const zL_real= rl;
  const zL_imag= xl;
  const numeratorReal= zL_real - z0;
  const numeratorImag= zL_imag;
  const denominatorReal= zL_real + z0;
  const denominatorImag= zL_imag;
  const numeratorMag= Math.hypot(numeratorReal, numeratorImag);
  const denominatorMag= Math.hypot(denominatorReal, denominatorImag);
  const gamma= numeratorMag / denominatorMag;
  const vswr= (1 + gamma) / (1 - gamma);
  return { 
    gamma: gamma, 
    vswr: vswr,
    reflection: gamma 
  };
}
 */

//Compute the magnitude of a vector.
//Math.hypot() returns the square root of 
// the sum of the squares of its arguments
/**
 * Example: Calculate input impedance for parallel transmission line branches
 * 
 * Setup:
 * - Branch 1: Transmission line with short circuit (ZL = 0)
 * - Branch 2: Transmission line with complex load
 * 
 * Both branches in parallel
 */

// Import the calculation class
// import { inputZ } from './input_z.js';

// ============= CONFIGURATION =============
// const Z0 = 50; // generator impedance (ohms)
// const Z01=1000; //branch ended by short circuit
// const Z02= 100; //branch ended by complex load
// const length1 = 0.075;             // 75mm
// const length2 = 0.15;             // 10 cm
// const frequency = 1000;          //MHz=> 1.0 GHz
// const vf = 1.0;       // Velocity factor (free space)

// // Branch 2: Complex load branch
// const ZL2_real = 100;              // Load resistance (ohms)
// const ZL2_imag = 0;              // Load reactance (ohms) - capacitive or inductive

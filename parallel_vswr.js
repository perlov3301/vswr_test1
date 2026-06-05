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
const frequency_n_input= document.getElementById("frequency_n")
const frequency1Input= document.getElementById("frequency1");
const line1_R= document.getElementById("line1_R");
const line2_R= document.getElementById("line2_R");
const line1_L= document.getElementById("line1_L");
const line2_L= document.getElementById("line2_L");
const load_real1= document.getElementById("load_real1");
const load_imag1= document.getElementById("load_imag1");
const resultDiv= document.getElementById("result");
const result_vswr= document.getElementById("result_vswr");
const explanationArea= document.getElementById("explanation");
const statusIndicator= document.getElementById("statusIndicator");

explanationArea.value+= "explanationArea is ready\n";
statusIndicator.replaceChildren("ready");
let currentState= "ready";
function setState(state) {
  currentState= state;
  const captions= {
    ready: "ready for input",
    modified: "Input changed",
    submitted: "Calculated",
    calculatedZin: "Zin was calculated",
    error_calculating: "error calculating Zin or VSWR",
    calculatedVSWR: "VSWR was calculated",
  };
  statusIndicator.textContent= captions[state] || state;
  statusIndicator.className= `status-indicator ${state}`;
}
function formatNumber(value) {
  return Number.isFinite(value) ? 
      value.toFixed(3): "N/A";
}

// ============= CALCULATION =============
import { inputZ } from './parallel_zin.js';
import { timenow } from './timenow.js';
import { calculate } from './calculateVSWR.js';
const vf=1;
// let vf=1;
const f_n= parseInt(frequency_n_input.value);
let f_array= [];
const f1= parseFloat(frequency1Input.value);
f_array[0]=f1;
function updateResult() {
  try {
    const Z0=  parseFloat(generatorR.value);
    const f_n= parseInt(frequency_n_input.value,10);
    const frequency= f1
    const Z01= parseFloat(line1_R.value);
    const Z02= parseFloat(line2_R.value);
    const length1= parseFloat(line1_L.value);
    const length2= parseFloat(line2_L.value);
    const ZL2_real= parseFloat(load_real1.value);
    const ZL2_imag= parseFloat(load_imag1.value);
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
  resultDiv.textContent= `Zin= 
        ${formatNumber(data.Zin_parallel.real)} 
        ${ZinImag} Ω` 
      ;
  explanationArea.value= `Calculated for two parallel branches:\n` +
      `line1(short circuit): Z01=${Z01}Ω and length=${length1}m\n` +
      `line2: Z02=${Z02}Ω, length=${length2}m; load ZL2=${ZL2_real}+${ZL2_imag}*j Ω\n` +
      `Frequency: ${frequency}MHz\n` +
      `Resulting Zin= ${formatNumber(data.Zin_parallel.real)} ${ZinImag} Ω\n` 
    
      ;
  setState("calculatedZin");
  const vswrData= calculate.calculateVSWR(Z0, data.Zin_parallel.real, data.Zin_parallel.imag);
  result_vswr.textContent= `VSWR: ${formatNumber(vswrData.vswr)} 
    (|Γ| = ${formatNumber(vswrData.gamma)})`;
  } catch (error) {
    resultDiv.textContent = "Error calculating impedance or VSWR.";
    explanationArea.value = error.message;
    setState("error_calculatingZin");
  }
}
//end of updateResult

function markModified() {
  if (currentState !== "modified") {
    setState("modified");
  } 
}
function markSubmitted() {
  if (currentState == "submitted") {}
    
}

generatorR.addEventListener("input", markModified);
frequency1Input.addEventListener("input", markModified);
line1_R.addEventListener("input", markModified);
line1_L.addEventListener("input", markModified);
line2_R.addEventListener("input", markModified);
line2_L.addEventListener("input", markModified);
load_real1.addEventListener("input", markModified);
load_imag1.addEventListener("input", markModified);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateResult();
});

setState(`time now: ${timenow()}; ready for input `);

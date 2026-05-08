// Listen for changes in document.readyState
document.addEventListener("readystatechange", () => {
    console.log("console; readyState:", document.readyState);
    const v_text = document.getElementById("explanation")
    v_text.value += `Current readyState: ${document.readyState}\n`;
    if (document.readyState==="interactive") {
      console.log("if to console;DOM is interactive");
    }
    if (document.readyState === "complete") {
        console.log("console;Page fully loaded.");
    }
});
const form = document.getElementById("vswrForm");
const impedanceInput = document.getElementById("impedance");
const loadRInput = document.getElementById("load_r");
const loadXInput = document.getElementById("load_X");
const resultDiv = document.getElementById("result");
const explanationArea = document.getElementById("explanation");
const statusIndicator = document.getElementById("statusIndicator");

let currentState = "ready";

function setState(state) {  
  currentState = state;
  const captions = {
    ready: "Ready",
    modified: "Input changed",
    submitted: "Calculated",
    error: "Error",
  };

  statusIndicator.textContent = captions[state] || state;
  statusIndicator.className = `status-indicator ${state}`;
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(3) : "N/A";
}

function calculateVSWR() {
  const z0 = parseFloat(impedanceInput.value);
  const r = parseFloat(loadRInput.value);
  const x = parseFloat(loadXInput.value);

  if (!z0 || Number.isNaN(z0) || Number.isNaN(r) || Number.isNaN(x)) {
    throw new Error("Please enter valid numeric values for impedance and load components.");
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

function updateResult() {
  try {
    const data = calculateVSWR();
    resultDiv.textContent = `VSWR: ${formatNumber(data.vswr)} (|Γ| = ${formatNumber(data.gamma)})`;
    explanationArea.value = `Calculated from Z0=${impedanceInput.value} Ω and ZL=${loadRInput.value} ${loadXInput.value >= 0 ? "+" : ""}${loadXInput.value}j Ω.\n` +
      `Reflection coefficient magnitude |Γ| = ${formatNumber(data.gamma)}.\n` +
      `VSWR = (1 + |Γ|) / (1 - |Γ|) = ${formatNumber(data.vswr)}.`;
    setState("submitted");
  } catch (error) {
    resultDiv.textContent = "VSWR: —";
    explanationArea.value = error.message;
    setState("error");
  }
}

function markModified() {
  if (currentState !== "modified") {
    setState("modified");
  }
}

impedanceInput.addEventListener("input", markModified);
loadRInput.addEventListener("input", markModified);
loadXInput.addEventListener("input", markModified);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateResult();
});

setState("ready");

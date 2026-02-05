const personas = [
  {
    name: "Gig Economy Driver",
    location: "Boyle Heights",
    insurance: "Covered CA",
    challenge: "No paid time off and high deductibles",
  },
  {
    name: "Service Worker",
    location: "South LA",
    insurance: "Medi-Cal",
    challenge: "Transit barriers to major cancer centers",
  },
  {
    name: "Middle-Income Renter",
    location: "San Fernando Valley",
    insurance: "Employer PPO",
    challenge: "High rent and rising out-of-pocket costs",
  },
];

const stages = ["Symptom", "Screening", "Diagnosis", "Treatment", "Survivorship"];

const waitTimes = {
  "medi-cal": "6 weeks",
  "employer": "2 weeks",
  "covered": "4 weeks",
};

const personaCards = document.getElementById("personaCards");
const barrierScore = document.getElementById("barrierScore");
const barrierValue = document.getElementById("barrierValue");
const rentBurden = document.getElementById("rentBurden");
const rentValue = document.getElementById("rentValue");
const insuranceTier = document.getElementById("insuranceTier");
const biomarkerCoverage = document.getElementById("biomarkerCoverage");
const journeyStage = document.getElementById("journeyStage");
const journeyStatus = document.getElementById("journeyStatus");
const financialHealth = document.getElementById("financialHealth");
const waitTime = document.getElementById("waitTime");
const housingStatus = document.getElementById("housingStatus");
const alertBox = document.getElementById("alertBox");
const policyImpact = document.getElementById("policyImpact");

let currentStage = 0;
let funds = 7500;
let warningShown = false;

const formatCurrency = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const updatePersonaCards = () => {
  personaCards.innerHTML = "";
  personas.forEach((persona) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${persona.name}</h3>
      <p><strong>Neighborhood:</strong> ${persona.location}</p>
      <p><strong>Coverage:</strong> ${persona.insurance}</p>
      <p>${persona.challenge}</p>
    `;
    personaCards.appendChild(card);
  });
};

const updateMetrics = () => {
  barrierValue.textContent = barrierScore.value;
  rentValue.textContent = formatCurrency(Number(rentBurden.value));
  waitTime.textContent = waitTimes[insuranceTier.value];
  financialHealth.textContent = formatCurrency(funds);

  const rentThreshold = Number(rentBurden.value) * 2.5;
  if (funds < rentThreshold) {
    housingStatus.textContent = "Housing Instability Warning";
    alertBox.textContent =
      "Housing instability risk detected. Consider policy action for rent stabilization.";
    warningShown = true;
  } else {
    housingStatus.textContent = "Stable";
    if (!warningShown) {
      alertBox.textContent = "";
    }
  }

  if (!biomarkerCoverage.checked && currentStage >= 2) {
    alertBox.textContent =
      "Biomarker testing denied. Appeals required, delaying personalized treatment.";
  }
};

const updateJourney = () => {
  journeyStage.textContent = stages[currentStage];
  const messages = [
    "Awaiting screening access.",
    "Prior authorization submitted.",
    "Waiting on diagnostic imaging.",
    "Treatment plan in progress.",
    "Survivorship plan established.",
  ];
  journeyStatus.textContent = messages[currentStage];
};

const advanceStage = () => {
  if (currentStage < stages.length - 1) {
    currentStage += 1;
  }

  const barrierImpact = Number(barrierScore.value) * 10;
  const rentImpact = Number(rentBurden.value) * 1.1;
  const insuranceImpact = insuranceTier.value === "medi-cal" ? 800 : 450;
  funds -= Math.round((barrierImpact + rentImpact + insuranceImpact) / 12);

  updateJourney();
  updateMetrics();

  if (funds < 2000) {
    alertBox.textContent =
      "High debt state reached. Activate Policy Action Mode to rewrite the outcome.";
  }
};

const resetSimulation = () => {
  currentStage = 0;
  funds = 7500;
  warningShown = false;
  updateJourney();
  updateMetrics();
  policyImpact.textContent = "Select a policy to rewrite the outcome.";
};

const applyPolicy = (policy) => {
  const messages = {
    biomarker: "SB-321 passed: biomarker testing covered. Treatment starts 3 weeks earlier.",
    transport: "Medi-Cal transport reimbursement expanded. Missed appointments reduced.",
    housing: "LA rent stabilization vouchers deployed. Housing remains secure during care.",
  };
  policyImpact.textContent = messages[policy];
  funds += 900;
  updateMetrics();
};

updatePersonaCards();
updateJourney();
updateMetrics();

barrierScore.addEventListener("input", updateMetrics);
insuranceTier.addEventListener("change", updateMetrics);
rentBurden.addEventListener("input", updateMetrics);
biomarkerCoverage.addEventListener("change", updateMetrics);

document.getElementById("advanceStage").addEventListener("click", advanceStage);
document.getElementById("resetSim").addEventListener("click", resetSimulation);

document.querySelectorAll(".policy-actions button").forEach((button) => {
  button.addEventListener("click", () => applyPolicy(button.dataset.policy));
});

// script.js
const assignments = [];

const form = document.getElementById("grade-form");
const nameInput = document.getElementById("assignment-name");
const earnedInput = document.getElementById("earned");
const possibleInput = document.getElementById("possible");
const weightInput = document.getElementById("weight");
const messageEl = document.getElementById("message");
const tbody = document.getElementById("assignments-body");
const gradeEl = document.getElementById("current-grade");
const weightsEl = document.getElementById("weights-entered");
const remainingEl = document.getElementById("remaining-weight");

function totalWeight() {
  return assignments.reduce((s, a) => s + a.weight, 0);
}

function updateSummary() {
  const tw = totalWeight();
  const remaining = 100 - tw;
  const grade = tw > 0
    ? (assignments.reduce((s, a) => s + (a.earned / a.possible) * a.weight, 0) / tw) * 100
    : 0;

  gradeEl.textContent = grade.toFixed(2) + "%";
  gradeEl.className = "summary-value " +
    (grade >= 90 ? "grade-green" : grade >= 80 ? "grade-blue" : grade >= 70 ? "grade-amber" : "grade-red");
  weightsEl.textContent = tw.toFixed(2) + "%";
  remainingEl.textContent = remaining.toFixed(2) + "%";
}

function renderList() {
  tbody.innerHTML = "";
  if (assignments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No assignments added yet.</td></tr>';
  } else {
    assignments.forEach((a, i) => {
      const pct = ((a.earned / a.possible) * 100);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.name}</td>
        <td>${a.earned} / ${a.possible}</td>
        <td>${a.weight}%</td>
        <td class="${pct >= 70 ? 'grade-green' : 'grade-red'}">${pct.toFixed(2)}%</td>
        <td><button class="delete-btn" data-index="${i}">🗑</button></td>`;
      tbody.appendChild(tr);
    });
  }
  updateSummary();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  messageEl.textContent = "";
  const w = parseFloat(weightInput.value);
  if (totalWeight() + w > 100) {
    messageEl.textContent = "Total weight would exceed 100% (" + totalWeight().toFixed(2) + "% used).";
    return;
  }
  assignments.push({
    name: nameInput.value.trim(),
    earned: parseFloat(earnedInput.value),
    possible: parseFloat(possibleInput.value),
    weight: w
  });
  form.reset();
  renderList();
});

tbody.addEventListener("click", function (e) {
  const btn = e.target.closest(".delete-btn");
  if (btn) {
    assignments.splice(parseInt(btn.dataset.index), 1);
    renderList();
  }
});

document.getElementById("reset-btn").addEventListener("click", function () {
  assignments.length = 0;
  form.reset();
  messageEl.textContent = "";
  renderList();
});

renderList();

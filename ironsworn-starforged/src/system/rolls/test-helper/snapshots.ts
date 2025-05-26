const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.resolve(__dirname, 'expected-outcomes.json');

export function loadOutcomes() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
}

export function saveOutcomes(outcomes: any) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outcomes, null, 2), 'utf-8');
}

export function getOutcomeKey({
  challengeDice1,
  challengeDice2,
  momentum,
  actionScore,
  burn,
}) {
  return `${challengeDice1}-${challengeDice2}-${momentum}-${actionScore}-${burn}`;
}

const fs = require('fs');
const path = require('path');

const outputFile = path.resolve(__dirname, 'expected-outcomes.json');

export function loadOutcomes() {
  if (!fs.existsSync(outputFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(outputFile));
}

export function saveOutcomes(outcomes: any) {
  fs.writeFileSync(outputFile, JSON.stringify(outcomes));
}

export function getOutcomeKey({
  challengeDie1,
  challengeDie2,
  momentum,
  actionScore,
  burn,
}) {
  return `${challengeDie1}-${challengeDie2}-${momentum}-${actionScore}-${burn}`;
}

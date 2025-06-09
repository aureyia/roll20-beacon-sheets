import fs from 'fs';
import path from 'path';
import { diff } from 'json-diff';

const outputFile = path.resolve(__dirname, 'expected-outcomes.json');
const testFile = path.resolve(__dirname, 'temp/test-outcomes.json');
const diffFile = path.resolve(__dirname, 'temp/diff.json');

export const loadOutcomes = () => {
  if (!fs.existsSync(outputFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(outputFile));
};

export const loadTestOutcomes = () => {
  if (!fs.existsSync(testFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(testFile));
};

export const saveOutcomes = (outcomes: any) => {
  fs.writeFileSync(outputFile, JSON.stringify(outcomes));
};

export const saveTestOutcomes = (outcomes: any) => {
  fs.writeFileSync(testFile, JSON.stringify(outcomes));
};

export const saveDiff = (results: any) => {
  fs.writeFileSync(diffFile, JSON.stringify(results));
};

export const getOutcomeKey = ({
  challengeDie1,
  challengeDie2,
  momentum,
  actionScore,
  burn,
}) => {
  return `${challengeDie1}-${challengeDie2}-${momentum}-${actionScore}-${burn}`;
};

export const compare = () => {
  const expectedOutcomes = loadOutcomes();
  const testOutomes = loadTestOutcomes();

  const results = diff(expectedOutcomes, testOutomes);

  if (results === undefined) {
    return 'No differences found.';
  } else {
    saveDiff(results);
    return 'Differences found!';
  }
};

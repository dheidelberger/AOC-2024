import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const colors = require('colors');
const G = require('generatorics');
const Heap = require('heap');
import * as setUtilities from '../Utilities/setUtilities.js';
import Grid from '../Utilities/Grid.js';
import { getInput } from '../Utilities/inputUtils.js';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const testMode = false;

let input = fs.readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8');

const muls = [...input.matchAll(/mul\((\d+),(\d+)\)/g)];
let sum = 0;
for (const mul of muls) {
    // console.log(mul);
    sum += +mul[1] * +mul[2];
}
console.log(sum);

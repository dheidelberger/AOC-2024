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
const list1 = [];
const list2 = {};

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .split('\n')
    .map((row) => row.split('   ').map((char) => +char));

for (let i = 0; i < input.length; i++) {
    const row = input[i];
    list1.push(row[0]);
    if (row[1] in list2) {
        list2[row[1]] += 1;
    } else {
        list2[row[1]] = 1;
    }
}
let diff = 0;
for (let i = 0; i < list1.length; i++) {
    let x = list1[i];
    let count = list2[x];
    if (count === undefined) count = 0;
    diff += x * count;
}

console.log(diff);

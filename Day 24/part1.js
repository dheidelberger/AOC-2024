import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const colors = require('colors');
const G = require('generatorics');
const Heap = require('heap');
const memoize = require('memoizee');
import * as setUtilities from '../Utilities/setUtilities.js';
import Grid from '../Utilities/Grid.js';
import Timer from '../Utilities/Timer.js';
import { getInput } from '../Utilities/inputUtils.js';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n');

const values = {};
const defined = new Set();
const variables = new Set();
for (const line of input[0].split('\n')) {
    let [vName, vVal] = line.split(': ');
    console.log(vName, vVal);
    vVal = +vVal;
    values[vName] = { value: vVal };
    defined.add(vName);
    variables.add(vName);
}
for (const line of input[1].split('\n')) {
    console.log(line);
    let matches = line.match(
        /([a-z0-9]{3}) (OR|AND|XOR) ([a-z0-9]{3}) -> ([a-z0-9]{3})/
    );
    const vName = matches[4];
    const op1 = matches[1];
    const op2 = matches[3];
    const operator = matches[2];
    values[vName] = { value: undefined, op1, op2, operator };
    variables.add(vName);
    variables.add(op1);
    variables.add(op2);
}
console.log(values);
// console.log(defined);
const variableArray = Array.from(variables);
const functions = variableArray.filter((v) => values[v].operator);
console.log(functions);
while (defined.size < variables.size) {
    for (const vName of functions) {
        const v = values[vName];
        if (!defined.has(v.op1) || !defined.has(v.op2)) {
            continue;
        }

        let returnValue;
        if (v.operator == 'OR') {
            returnValue = values[v.op1].value | values[v.op2].value;
        } else if (v.operator === 'AND') {
            returnValue = values[v.op1].value & values[v.op2].value;
        } else if (v.operator === 'XOR') {
            returnValue = values[v.op1].value ^ values[v.op2].value;
        }

        values[vName].value = returnValue;
        defined.add(vName);
    }
}

const zs = variableArray
    .filter((v) => v.match(/z/))
    .sort()
    .reverse();
let outputString = '';
for (const z of zs) {
    outputString += `${values[z].value}`;
}
console.log(parseInt(outputString, 2));
timer.stop();

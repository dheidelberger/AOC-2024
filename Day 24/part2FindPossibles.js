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
import { error } from 'console';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);

const testMode = false;

function solve(values) {
    const defined = new Set();

    const variableArray = Object.keys(values);
    const functions = variableArray.filter((v) => values[v].operator);
    for (const v of variableArray) {
        if (values[v].value !== -1) {
            defined.add(v);
        }
    }

    let lastSize = defined.size;
    while (defined.size < variableArray.length) {
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
        if (defined.size === lastSize) {
            throw new Error('Looped');
        }
        lastSize = defined.size;
    }

    const zs = variableArray
        .filter((v) => v.match(/z/))
        .sort()
        .reverse();
    let outputString = '';
    for (const z of zs) {
        outputString += `${values[z].value}`;
    }
    return parseInt(outputString, 2);
}

function setOperand(value, label, values, digits) {
    value = value.toString(2).padStart(digits, '0').split('').reverse();
    for (let i = 0; i < value.length; i++) {
        let iString = `${i}`.padStart(2, '0');
        let outLabel = `${label}${iString}`;
        values[outLabel].value = +value[i];
    }
}

function operandString(operand, digits) {
    return operand.toString(2).padStart(digits, '0');
}

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n');

const originalValues = {};
for (const line of input[0].split('\n')) {
    let [vName, vVal] = line.split(': ');
    vVal = +vVal;
    originalValues[vName] = { value: vVal };
}
for (const line of input[1].split('\n')) {
    let matches = line.match(
        /([a-z0-9]{3}) (OR|AND|XOR) ([a-z0-9]{3}) -> ([a-z0-9]{3})/
    );
    const vName = matches[4];
    const op1 = matches[1];
    const op2 = matches[3];
    const operator = matches[2];
    originalValues[vName] = { value: -1, op1, op2, operator };
}

const inputPowers = Object.keys(originalValues).filter((v) =>
    v.match(/x/)
).length;
const outputPowers = Object.keys(originalValues).filter((v) =>
    v.match(/z/)
).length;
let wrongDigits = [];
for (let i = 0; i < inputPowers; i++) {
    const values = JSON.parse(JSON.stringify(originalValues));
    let operandA = 2 ** i;
    let operandB = 0;
    setOperand(operandA, 'x', values, inputPowers);
    setOperand(operandB, 'y', values, inputPowers);

    console.log(operandString(operandA, outputPowers), '+');
    console.log(operandString(operandB, outputPowers));
    console.log('-'.repeat(outputPowers));

    let expected = operandA + operandB;
    console.log(operandString(expected, outputPowers));

    const result = solve(values);
    console.log(operandString(result, outputPowers));
    if (expected !== result) {
        wrongDigits.push(i);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    }

    console.log();
    console.log();
}
console.log('Wrong digits:');
console.log(wrongDigits);

const variableArray = Object.keys(originalValues);
const functions = variableArray.filter((v) => originalValues[v].operator);
const possibles = {};
for (const digit of wrongDigits) {
    const targetZ = `z` + `${digit}`.padStart(2, '0');

    console.log('Possibles for Digit:', targetZ);
    let operations = [];
    let toVisit = [targetZ];
    while (toVisit.length > 0) {
        const currentOp = toVisit.pop();
        const op = originalValues[currentOp];
        if (op.operator) {
            toVisit.push(op.op1);
            toVisit.push(op.op2);
            operations.push({ v: currentOp, op });
        }
    }
    console.log(`Touches ${operations.length} operations`);
    const possibleSwapsForDigit = [];
    const testValues = [0, 2 ** digit];
    for (let i = 0; i < operations.length; i++) {
        let a = operations[i].v;
        console.log(a);
        for (let o = 0; o < functions.length; o++) {
            let b = functions[o];
            // console.log();
            // console.log('Swap:', a, b);
            let possibleSwap = true;
            for (const operandA of testValues) {
                const testValues = JSON.parse(JSON.stringify(originalValues));
                let temp = testValues[a];
                testValues[a] = testValues[b];
                testValues[b] = temp;
                let operandB = 0;
                setOperand(operandA, 'x', testValues, inputPowers);
                setOperand(operandB, 'y', testValues, inputPowers);

                // console.log(operandString(operandA, outputPowers), '+');
                // console.log(operandString(operandB, outputPowers));
                // console.log('-'.repeat(outputPowers));

                let expected = operandA + operandB;
                // console.log(operandString(expected, outputPowers));

                try {
                    const result = solve(testValues);
                    // console.log(operandString(result, outputPowers));
                    if (result !== expected) {
                        possibleSwap = false;
                        break;
                    }
                } catch (err) {
                    // console.log('Invalid swap');
                    possibleSwap = false;
                }
                // console.log();
            }
            if (possibleSwap) {
                possibleSwapsForDigit.push([a, b]);
            }
        }
    }
    console.log(possibleSwapsForDigit);
    possibles[digit] = possibleSwapsForDigit;
}
fs.writeFileSync('part2PossibleSolutions.json', JSON.stringify(possibles));
timer.stop();

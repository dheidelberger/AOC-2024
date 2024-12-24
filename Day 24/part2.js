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

const possibles = JSON.parse(fs.readFileSync('part2PossibleSolutions.json'));

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

const testValuesA = [
    0b10101010101010101010101010101010101010101010,
    0b01010101010101010101010101010101010101010101,
    0b11111111111111111111111111111111111111111111, 0,
    0b10101010101010101010101010101010101010101010,
    0b01010101010101010101010101010101010101010101,
    0b11111111111111111111111111111111111111111111, 0,
];
const testValuesB = [0, 0, 0, 0, 1, 1, 1, 1];

const inputPowers = Object.keys(originalValues).filter((v) =>
    v.match(/x/)
).length;
const outputPowers = Object.keys(originalValues).filter((v) =>
    v.match(/z/)
).length;

for (let i = 0; i < inputPowers; i++) {
    testValuesA.push(2 ** i);
    testValuesA.push(2 ** i);
    testValuesA.push(2 ** i);
    testValuesB.push(0);
    testValuesB.push(0b11111111111111111111111111111111111111111111);
    testValuesB.push(2 ** i);
}

const swap0 = possibles['37'];
const swap1 = possibles['16'];
const swap2 = possibles['21'];
const swap3 = possibles['31'];
//     [
//     ['z37', 'rrn'],
//     ['z37', 'z38'],
//     ['z37', 'jrg'],
//     ['z37', 'gcg'],
// ];
// const swap1 = [
//     ['z16', 'fkb'],
//     ['z16', 'z17'],
//     ['bss', 'grr'],
//     ['bss', 'fkb'],
//     ['bss', 'z17'],
//     ['tnn', 'fkb'],
//     ['tnn', 'z17'],
//     ['grr', 'bss'],
// ];

// const swap2 = [
//     ['z21', 'sfw'],
//     ['z21', 'nnr'],
//     ['hvv', 'nnr'],
//     ['smh', 'nnr'],
//     ['fpv', 'nnr'],
//     ['rqf', 'nnr'],
// ];

// const swap3 = [
//     ['z31', 'rdn'],
//     ['z31', 'vtb'],
//     ['z31', 'z32'],
// ];

for (const s0 of swap0) {
    for (const s1 of swap1) {
        for (const s2 of swap2) {
            for (const s3 of swap3) {
                console.log('Trying:', s0, s1, s2, s2);
                const swapList = [s0, s1, s2, s3];
                const swappedValues = JSON.parse(
                    JSON.stringify(originalValues)
                );
                for (const swap of swapList) {
                    let a = swap[0];
                    let b = swap[1];
                    let temp = swappedValues[a];
                    swappedValues[a] = swappedValues[b];
                    swappedValues[b] = temp;
                }

                let failedTests = 0;
                for (let i = 0; i < testValuesA.length; i++) {
                    const values = JSON.parse(JSON.stringify(swappedValues));
                    let operandA = testValuesA[i];
                    let operandB = testValuesB[i];
                    setOperand(operandA, 'x', values, inputPowers);
                    setOperand(operandB, 'y', values, inputPowers);

                    // console.log(operandString(operandA, outputPowers), '+');
                    // console.log(operandString(operandB, outputPowers));
                    // console.log('-'.repeat(outputPowers));

                    let expected = operandA + operandB;
                    // console.log(operandString(expected, outputPowers));

                    const result = solve(values);
                    // console.log(operandString(result, outputPowers));
                    if (expected !== result) {
                        failedTests++;
                        break;
                    }
                    // console.log();
                    // console.log();
                }

                if (failedTests === 0) {
                    console.log('Solution found!');
                    const out = [];
                    for (const swapPair of swapList) {
                        console.log(swapPair);
                        out.push(swapPair[0]);
                        out.push(swapPair[1]);
                    }
                    console.log(out.sort().join(','));
                    timer.stop();
                    process.exit();
                }
            }
        }
    }
}

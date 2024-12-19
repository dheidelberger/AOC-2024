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

let [A, B, C] = input[0]
    .split('\n')
    .map((row) => +row.match(/Register (A|B|C): (\d+)/)[2]);
const opcodes = input[1]
    .split(': ')[1]
    .split(',')
    .map((val) => +val.trim());
console.log(input);
console.log(A, B, C);
console.log(opcodes);
const programOutput = [];

function operandComboValue(operand) {
    if (operand < 4) return operand;
    if (operand == 4) return A;
    if (operand == 5) return B;
    if (operand == 6) return C;
}

function operandType(operand) {
    if (operand < 4) return 'Literal';
    if (operand == 4) return 'A';
    if (operand == 5) return 'B';
    if (operand == 6) return 'C';
    if (operand == 7) return 'Reserved';
}

function division(operand) {
    operand = operandComboValue(operand);
    return Math.floor(A / Math.pow(2, operand));
}

function adv(operand) {
    A = division(operand);
}
function bxl(operand) {
    B = B ^ operand;
}
function bst(operand) {
    operand = operandComboValue(operand);
    B = operand % 8;
}
function jnz(operand) {
    if (A === 0) return;
    instructionPointer = operand - 2; //So it will still jump by 2
}
function bxc(_) {
    B = B ^ C;
}
function out(operand) {
    programOutput.push(operandComboValue(operand) % 8);
}
function bdv(operand) {
    B = division(operand);
}
function cdv(operand) {
    C = division(operand);
}

function printState(opcode = null, operand = null) {
    if (opcode !== null) {
        console.log(functionNames[opcode]);
    }
    if (operand !== null) {
        console.log('LO:', operand.toString(2).padStart(7, '0'), operand);

        if (operand < 7) {
            console.log(
                'CO:',
                operandComboValue(operand).toString(2).padStart(7, '0'),
                operandComboValue(operand),
                operandType(operand)
            );
        }
    }
    console.log(' A:', A.toString(2).padStart(7, '0'), A);
    console.log(' B:', B.toString(2).padStart(7, '0'), B);
    console.log(' C:', C.toString(2).padStart(7, '0'), C);

    console.log('Output:', programOutput);
}

const functions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];
const functionNames = [
    'adv: A = A >> combo operand',
    'bxl: B = B XOR literal operand',
    'bst: B = combo operand % 8',
    'jnz: A == 0 ? Pass : IP = literal operand ',
    'bxc: B = B XOR C',
    'out: output combo operand % 8',
    'bdv: B = A >> combo operand',
    'cdv: C = A >> combo operand',
];

let instructionPointer = 0;

while (instructionPointer < opcodes.length) {
    let opcode = opcodes[instructionPointer];
    let operand = opcodes[instructionPointer + 1];
    console.log('Before operation');
    printState(opcode, operand);
    functions[opcode](operand);
    instructionPointer += 2;
    console.log('After operation');
    printState();
    console.log();
}
console.log(programOutput.join(','));
timer.stop();

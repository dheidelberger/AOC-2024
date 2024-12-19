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
A = BigInt(A);
B = BigInt(B);
C = BigInt(C);
const opcodes = input[1]
    .split(': ')[1]
    .split(',')
    .map((val) => +val.trim());
console.log(input);
console.log(A, B, C);
console.log(opcodes);
let programOutput = [];

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
    return A >> operand;
}

function adv(operand) {
    A = division(operand);
}
function bxl(operand) {
    B = B ^ operand;
}
function bst(operand) {
    operand = operandComboValue(operand);
    B = operand % BigInt(8);
}
function jnz(operand) {
    if (A == 0) return;
    instructionPointer = operand - BigInt(2); //So it will still jump by 2
}
function bxc(_) {
    B = B ^ C;
}
function out(operand) {
    programOutput.push(operandComboValue(operand) % BigInt(8));
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

const functions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

let instructionPointer = BigInt(0);

let aTotal = BigInt(0);

/*
 * Probably not the most efficient solution. This could be broken up to only run the program loop for one
 * output at a time and not run the whole program each iteration. But it runs quickly so I didn't bother.
 */
for (let i = 0; i < opcodes.length; i++) {
    aTotal *= BigInt(8);
    const opSlice = opcodes.slice(-(i + 1));
    const targetString = opSlice.join(',');
    console.log('aTotal:', aTotal, aTotal.toString(2));
    console.log('Target:');
    console.log(targetString);

    let foundMatch = false;
    for (let o = 0; o < 8; o++) {
        console.log('   Trying:', o);
        const aVal = aTotal + BigInt(o);
        A = aVal;
        B = BigInt(0);
        C = BigInt(0);
        instructionPointer = BigInt(0);
        programOutput = [];
        while (instructionPointer < opcodes.length) {
            let opcode = opcodes[instructionPointer];
            let operand = BigInt(opcodes[instructionPointer + BigInt(1)]);
            // console.log('Before operation');
            // printState(opcode, operand);
            functions[opcode](operand);
            instructionPointer += BigInt(2);
            // console.log('After operation');
            // printState();
        }
        const programOutputJoined = programOutput.join(',');
        console.log('      Output:', programOutputJoined);
        if (programOutputJoined === targetString) {
            console.log('        Matched!');
            aTotal += BigInt(o);
            foundMatch = true;

            break;
        }
    }
    if (!foundMatch) {
        console.log('NO MATCH!!!'.red);
    }
}
console.log(aTotal.toString());

timer.stop();
// 190384615275520 - Wrong - had to convert everything to BigInt

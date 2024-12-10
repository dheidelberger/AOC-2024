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
console.time('Run Time');

const testMode = false;

const operators = ['+', '*', '||'];

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => {
        let [sum, operands] = row.split(': ');
        sum = +sum;
        operands = operands.split(' ').map((operand) => +operand);
        return { sum, operands };
    });
console.log(input);

let sum = 0;
let count = 0;
for (const puzzle of input) {
    if (count % 100 === 0) {
        console.log(`Puzzle ${count}/${input.length}`.green);
    }
    count++;
    const size = puzzle.operands.length;
    const perms = G.baseN(operators, size - 1);
    for (let perm of perms) {
        let total = puzzle.operands[0];
        let prettyString = `${puzzle.operands[0]} `;
        for (let i = 0; i < perm.length; i++) {
            if (total > puzzle.sum) {
                break;
            }
            prettyString += perm[i] + ' ' + puzzle.operands[i + 1] + ' ';
            if (perm[i] === '||') {
                total = +`${total}${puzzle.operands[i + 1]}`;
            } else if (perm[i] === '+') {
                total = total + puzzle.operands[i + 1];
            } else {
                total = total * puzzle.operands[i + 1];
            }
        }
        if (total == puzzle.sum) {
            prettyString += ' = ' + puzzle.sum;
            console.log(prettyString);
            sum += +puzzle.sum;
            break;
        }
    }
}

console.log(sum);
console.timeEnd('Run Time');

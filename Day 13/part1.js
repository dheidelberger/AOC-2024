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

// Button A: X+92, Y+17
// Button B: X+27, Y+61
// Prize: X=9152, Y=6172
let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n')
    .map((inputSet) => {
        const rows = inputSet.split('\n');
        const rowMatchA = rows[0].match(/Button (A|B): X\+(\d+), Y\+(\d+)/);
        const rowMatchB = rows[1].match(/Button (A|B): X\+(\d+), Y\+(\d+)/);
        const prizeMatch = rows[2].match(/Prize: X=(\d+), Y=(\d+)/);
        const a = { x: +rowMatchA[2], y: +rowMatchA[3] };
        const b = { x: +rowMatchB[2], y: +rowMatchB[3] };
        const prize = { x: +prizeMatch[1], y: +prizeMatch[2] };
        return { a, b, prize };
    });

console.log(input);

let tokens = 0;

// h/t Wolfram Alpha for the algebra.
// Fed in the equation (y3 - b * y2)/y1 = (x3 - b * x2)/x1 and asked it to solve for b, which gave:
// (x3 * y1 - x1 * y3) / (x2 * y1 - x1 * y2);
// Found the algebraic solution for part 1. I was looking for a quadratic equation or something since the
// possibility of multiple solutions was raised. But it looks like there was only one possible solution per machine
// WA also gave several constraints, which I coded in, but I guess they never came up.
// Link: https://www.wolframalpha.com/input?i2d=true&i=Divide%5B%5C%2840%29Subscript%5By%2C3%5D+-+b+*+Subscript%5By%2C2%5D%5C%2841%29%2CSubscript%5By%2C1%5D%5D+%3D+Divide%5B%5C%2840%29Subscript%5Bx%2C3%5D+-+b+*+Subscript%5Bx%2C2%5D%5C%2841%29%2CSubscript%5Bx%2C1%5D%5D+solve+for+b
for (const row of input) {
    console.log(row);
    const x1 = row.a.x;
    const x2 = row.b.x;
    const x3 = row.prize.x;
    const y1 = row.a.y;
    const y2 = row.b.y;
    const y3 = row.prize.y;

    if (x2 * y1 === x1 * y2) {
        console.log('x2y1===x1y2, no solution');
        continue;
    }
    if (x1 * y1 === 0) {
        console.log('x1y1===0, no solution');
        continue;
    }
    const b = (x3 * y1 - x1 * y3) / (x2 * y1 - x1 * y2);
    const a = (x3 - b * x2) / x1;
    console.log(a, b);
    if (Math.round(a) !== a || Math.round(b) !== b) {
        console.log('Not round numbers');
        continue;
    }
    tokens += 3 * a + b;
}
console.log(tokens);
timer.stop();

// a * x1 + b * x2 = x3
// a * y1 + b * y2 = y3
// a = (x3-b*x2)/(x1)
// (y3 - b * y2)/y1 = (x3 - b * x2)/x1

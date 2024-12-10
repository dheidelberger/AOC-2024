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

let enabled = true;
const muls = [
    ...input.matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g),
];
let part1 = 0;
let part2 = 0;
for (const mul of muls) {
    if (mul[0] === 'do()') {
        enabled = true;
    } else if (mul[0] === "don't()") {
        enabled = false;
    } else {
        const product = +mul[2] * +mul[3];
        part1 += product;
        if (enabled) {
            part2 += product;
        }
    }
}
console.log('Part 1:', part1);
console.log('Part 2:', part2);

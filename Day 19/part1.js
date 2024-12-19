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

let availablePatterns = input[0].split(', ');
console.log(availablePatterns);

const desiredPatterns = input[1].split('\n');
console.log(desiredPatterns);

function solve(targetPattern, ranges) {
    const cache = {};
    function recurse(index) {
        if (index in cache) return cache[index];
        if (index > targetPattern.length) {
            cache[index] = false;
            return false;
        }
        if (index === targetPattern.length) {
            cache[index] = true;
            return true;
        }
        if (!(index in ranges)) return false;

        let foundResult = false;
        for (const range of ranges[index]) {
            const result = recurse(range.end);
            if (result) foundResult = true;
        }
        cache[index] = foundResult;
        return foundResult;
    }

    return recurse(0);
}

let sum = 0;
for (let i = 0; i < desiredPatterns.length; i++) {
    const currentPattern = desiredPatterns[i];
    console.log('Pattern:', currentPattern);
    let ranges = {};
    for (const pattern of availablePatterns) {
        for (let o = 0; o < currentPattern.length; o++) {
            if (pattern === currentPattern.slice(o, o + pattern.length)) {
                // console.log(pattern, 'matches at', o);
                const rangeObj = { start: o, end: o + pattern.length, pattern };
                if (o in ranges) {
                    ranges[o].push(rangeObj);
                } else {
                    ranges[o] = [rangeObj];
                }
            }
        }
    }
    // console.log(ranges);
    const results = solve(currentPattern, ranges);
    console.log(results);
    console.log();
    if (results) sum++;
}
console.log(sum);

timer.stop();

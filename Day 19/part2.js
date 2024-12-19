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
    let index = targetPattern.length - 1;
    let cache = {};

    while (index >= 0) {
        // console.log('Testing index', index);
        let results = 0;
        if (index in ranges) {
            // console.log('This index has ranges');
            // console.log(ranges[index]);
            const testRanges = ranges[index];
            for (const range of testRanges) {
                // console.log('Range:', range);
                if (range.end in cache) {
                    results += cache[range.end];
                } else if (range.end === targetPattern.length) {
                    results++;
                }
            }
        }
        cache[index] = results;

        index--;
    }
    // console.log(cache);
    return cache[0];
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
    sum += results;
}
console.log(sum);

timer.stop();

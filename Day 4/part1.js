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

let rawInput = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .split('\n');

let input = rawInput.map((row) => row.split(''));

console.log(rawInput.join('\n'));

let count = 0;

const targetWord = ['X', 'M', 'A', 'S'];
const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];

for (let r = 0; r < input.length; r++) {
    const row = input[r];
    for (let c = 0; c < row.length; c++) {
        let cell = row[c];
        if (cell === 'X') {
            console.log('Found X at', r, c);
            for (let dir of directions) {
                console.log('  Checking direction', dir);
                let posR = r;
                let posC = c;
                let foundWord = true;
                for (let letter = 1; letter < targetWord.length; letter++) {
                    posR += dir[0];
                    posC += dir[1];
                    const targetLetter = targetWord[letter];
                    console.log(
                        `    Looking for ${targetLetter} at ${posR},${posC}`
                    );
                    if (
                        posR >= input.length ||
                        posR < 0 ||
                        posC >= row.length ||
                        posC < 0
                    ) {
                        console.log('      Out of bounds');
                        foundWord = false;
                        break;
                    }
                    const actualLetter = input[posR][posC];
                    console.log('      Found:', actualLetter);
                    if (targetLetter !== actualLetter) {
                        console.log('      Not a match');
                        foundWord = false;
                        break;
                    }
                }
                if (foundWord) {
                    console.log('  Found a match!');
                    count++;
                }
            }
        }
    }
}
console.log(count);

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

let input = rawInput.map((row) =>
    row.split('').map((letter) => {
        if (['M', 'A', 'S'].indexOf(letter) === -1) return '.';
        return letter;
    })
);

console.log(input.map((row) => row.join('')).join('\n'));
let count = 0;

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

const validStrings = [
    [`M.M`, `M.S`, `S.M`, `S.S`],
    [`S.S`, `M.S`, `S.M`, `M.M`],
];

for (let r = 0; r < input.length - 2; r++) {
    const row = input[r];
    console.log(row);
    for (let c = 0; c < row.length - 2; c++) {
        let rowArr = [];
        let slice1 = row.slice(c, c + 3).join('');
        slice1 = setCharAt(slice1, 1, '.');
        rowArr.push(slice1);

        let slice2 = input[r + 1].slice(c, c + 3).join('');
        slice2 = setCharAt(slice2, 0, '.');
        slice2 = setCharAt(slice2, 2, '.');

        let slice3 = input[r + 2].slice(c, c + 3).join('');
        slice3 = setCharAt(slice3, 1, '.');
        rowArr.push(slice3);

        let matchIndices = new Set();
        for (let i = 0; i < 2; i++) {
            const matchIndex = validStrings[i].indexOf(rowArr[i]);
            console.log(`${rowArr[i]} in ${validStrings[i]} == ${matchIndex}`);
            matchIndices.add(matchIndex);
        }
        if (
            slice2 === '.A.' &&
            matchIndices.size === 1 &&
            !matchIndices.has(-1)
        ) {
            count++;
        }
    }
}
console.log(count);

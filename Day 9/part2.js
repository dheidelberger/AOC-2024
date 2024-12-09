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

let drive = [];

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('')
    .map((char) => +char);
console.log(input);
const files = [];
const freeSpace = [];
let position = 0;

for (let i = 0; i < input.length; i += 2) {
    for (let o = 0; o < input[i]; o++) {
        drive.push(`${i / 2}`);
    }
    files.push({ start: position, length: input[i] });
    position += input[i];

    if (i < input.length - 1) {
        for (let o = 0; o < input[i + 1]; o++) {
            drive.push('.');
        }
        freeSpace.push({ start: position, length: input[i + 1] });

        position += input[i + 1];
    }
}
console.log(drive);
console.log(files);
console.log(freeSpace);
for (let i = files.length - 1; i >= 0; i--) {
    let file = files[i];
    let desiredLength = file.length;
    for (let o = 0; o < freeSpace.length; o++) {
        let free = freeSpace[o];
        if (free.start > file.start) break;
        if (free.length >= desiredLength) {
            for (let z = 0; z < desiredLength; z++) {
                drive[free.start + z] = i;
                drive[file.start + z] = '.';
            }
            free.length -= desiredLength;
            free.start += desiredLength;
            if (free.length <= 0) {
                freeSpace.splice(o, 1);
            }
            break;
        }
    }
    // console.log(drive.join(''));
}

// console.log(drive.join(''));
let sum = 0;
for (let i = 0; i < drive.length; i++) {
    if (drive[i] === '.') continue;
    sum += i * +drive[i];
}
console.log(sum);
console.timeEnd('Run Time');

// 00992111777.44.333....5555.6666.....8888..
// 00992111777.44.333....5555.6666.....8888..

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
        for (let o = 0; o < input[i + 1]; o++) {
            freeSpace.push(position + o);
        }

        position += input[i + 1];
    }
}
console.log(drive);
console.log(files);
console.log(freeSpace);
let currentFileIndex = files.length - 1;
for (let i = 0; i < freeSpace.length; i++) {
    const currentFile = files[currentFileIndex];
    let swapChar = currentFile.start + (currentFile.length - 1);
    drive[freeSpace[i]] = `${currentFileIndex}`;
    drive[swapChar] = '.';
    freeSpace.push(swapChar);
    currentFile.length--;
    if (currentFile.length === 0) currentFileIndex--;
    // console.log(drive.join(''));
    if (freeSpace[i + 1] > files[currentFileIndex].start) break;
    // if (currentFileIndex < 0) break;
}
console.log(drive.join(''));
let sum = 0;
for (let i = 0; i < drive.length; i++) {
    if (drive[i] === '.') break;
    sum += i * +drive[i];
}
console.log(sum);
console.timeEnd('Run Time');

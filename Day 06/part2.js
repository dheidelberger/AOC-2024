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

function key(row, col, direction) {
    return `${row}_${col}_${direction}`;
}

let input = fs.readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8');

const grid = new Grid(input);

let empties = grid.getAllCells().filter((cell) => cell.value === '.');

let loopCount = 0;

let count = 0;
let totalSize = empties.length;
for (const emptyCell of empties) {
    if (count % 1000 === 0) {
        console.log(`Attempt: ${count}/${totalSize}`);
    }
    let guard = grid.getAllCells().filter((cell) => cell.value === '^')[0];
    emptyCell.value = '#';
    let guardRow = guard.row;
    let guardCol = guard.column;
    const directions = Grid.cardinalDirections;
    let directionIndex = 0;
    let visited = new Set([key(guardRow, guardCol, directionIndex)]);
    let guardInPlay = true;
    while (guardInPlay) {
        let nextCell = guard.getCellInDirection(directions[directionIndex]);
        if (nextCell.value === '#') {
            directionIndex = (directionIndex + 1) % 4;
            continue;
        }
        guard = nextCell;
        if (guard.outOfBounds) {
            guardInPlay = false;
            break;
        }
        let theKey = key(guard.row, guard.column, directionIndex);
        if (visited.has(theKey)) {
            loopCount++;
            break;
        }
        visited.add(theKey);
    }
    count++;
    emptyCell.value = '.';
}
console.log(loopCount);
console.timeEnd('Run Time');

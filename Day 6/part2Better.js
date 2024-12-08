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
function rowColKey(row, col) {
    return `${row}_${col}`;
}

function guardWalk(guard) {
    let isLoop = false;
    let steps = 0;
    if (guard.value !== '^') {
        // console.log('Guard spot');
        return [false, null];
    }
    let guardRow = guard.row;
    let guardCol = guard.column;
    const directions = Grid.cardinalDirections;
    let directionIndex = 0;
    let visited = new Set([key(guardRow, guardCol, directionIndex)]);
    let visitedCellsOnly = new Set([rowColKey(guardRow, guardCol)]);
    let guardInPlay = true;
    while (guardInPlay) {
        steps++;
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
            isLoop = true;
            break;
        }
        visited.add(theKey);
        visitedCellsOnly.add(rowColKey(guard.row, guard.column));
    }
    return [isLoop, visitedCellsOnly, steps];
}

let input = fs.readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8');

const grid = new Grid(input);

let empties = grid.getAllCells().filter((cell) => cell.value === '.');
console.log('Empty cell count:', empties.length);

const startingGuard = grid
    .getAllCells()
    .filter((cell) => cell.value === '^')[0];
let loopCount = 0;

let [_, visited] = guardWalk(startingGuard);
console.log('Cells visited (part 1):', visited.size);

let visitedArray = Array.from(visited);
for (const emptyCellKey of visitedArray) {
    let [row, col] = emptyCellKey.split('_').map((val) => +val);
    const emptyCell = grid.getCell(row, col);
    let currentVal = emptyCell.value;

    emptyCell.value = '#';
    let [isLoop, _, __] = guardWalk(startingGuard);
    if (isLoop) {
        loopCount++;
    }

    emptyCell.value = currentVal;
}
console.log('Part 2:', loopCount);
console.timeEnd('Run Time');

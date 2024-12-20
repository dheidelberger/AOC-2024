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
    .split('\n');

const grid = new Grid(input);
const startCell = grid.getAllCells().filter((cell) => cell.value === 'S')[0];
const endCell = grid.getAllCells().filter((cell) => cell.value === 'E')[0];
const gridPath = grid.dijkstra(startCell, endCell, '#');
console.log(startCell);
console.log(grid);
// console.log(gridPath);
const totalPathLength = gridPath.length - 1;
for (let i = 0; i < gridPath.length; i++) {
    const cell = gridPath[i];
    cell.pathIndex = i;
}
const savings = {};
let gte100 = 0;
for (let i = 0; i < gridPath.length; i++) {
    const cell = gridPath[i];
    // console.log(cell);
    const neighbors = cell
        .getCellsInDirections(Grid.cardinalDirections, 2)
        .filter((direction) => direction.map((c) => c.value).join('') === '#0')
        .filter((direction) => direction[1].pathIndex > cell.pathIndex);

    for (const neighbor of neighbors) {
        const diff = neighbor[1].pathIndex - cell.pathIndex - 2;
        // console.log('   ', neighbor, diff);
        if (diff in savings) {
            savings[diff]++;
        } else {
            savings[diff] = 1;
        }
        if (diff >= 100) {
            gte100++;
        }
    }
    cell.pathIndex = i;
}

// console.log(savings);
console.log(gte100);
timer.stop();

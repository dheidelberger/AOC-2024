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
console.log(grid);
for (let i = 0; i < gridPath.length; i++) {
    const cell = gridPath[i];
    cell.pathIndex = i;
}
const savings = {};
let gte100 = 0;
for (let i = 0; i < gridPath.length; i++) {
    const cell = gridPath[i];
    // console.log(cell);
    for (let o = i + 1; o < gridPath.length; o++) {
        const cell2 = gridPath[o];
        const manhattanDistance =
            Math.abs(cell2.row - cell.row) +
            Math.abs(cell2.column - cell.column);
        if (manhattanDistance <= 20) {
            const diff = cell2.pathIndex - cell.pathIndex - manhattanDistance;
            // console.log('   ', cell2, diff);

            if (diff >= 50) {
                if (diff in savings) {
                    savings[diff]++;
                } else {
                    savings[diff] = 1;
                }
            }
            if (diff >= 100) {
                gte100++;
            }
        }
    }
    // console.log();
    // console.log();
}

// console.log(savings);
console.log(gte100);
timer.stop();

// Wrong answer: 1026498 -
// Got the basics right very quickly, but dumb bug on line 48 where I
// continued to subtract 2 from part 1 instead of the Manhattan distance. Spent at least
// 10 minutes debugging this

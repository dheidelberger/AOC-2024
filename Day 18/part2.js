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
const gridSize = testMode ? 7 : 71;
const startPoint = testMode ? 0 : 1000;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => {
        let positions = row.split(',').map((pos) => +pos.trim());
        return { r: positions[1], c: positions[0] };
    });
let rawGridStrings = [];
for (let i = 0; i < gridSize; i++) {
    let row = '.'.repeat(gridSize);
    rawGridStrings.push(row);
}

rawGridStrings = rawGridStrings.join('\n');

for (let steps = input.length - 1; steps >= 0; steps--) {
    if (steps % 10 === 0) {
        console.log('Step:', steps, 'of', input.length);
    }
    const grid = new Grid(rawGridStrings);
    input.slice(0, steps).forEach((position) => {
        const cell = grid.getCell(position.r, position.c);
        cell.value = '#';
        cell.setColor(colors.red);
    });
    const sptSet = new Set();
    let allCells = grid
        .getAllCells()
        .filter((cell) => cell.value !== '#')
        .map((cell) => {
            cell.distance = Infinity;
            return cell;
        });

    const start = grid.getCell(0, 0);
    start.distance = 0;

    allCells.sort((a, b) => b.distance - a.distance);
    while (allCells.length > 0) {
        const current = allCells.pop();
        sptSet.add(current.key);
        for (const successorCell of current.getCellInDirections(
            Grid.cardinalDirections
        )) {
            if (!successorCell.outOfBounds && successorCell.value !== '#') {
                const newDistance = current.distance + 1;
                if (newDistance < successorCell.distance) {
                    successorCell.distance = newDistance;
                }
            }
        }
        allCells.sort((a, b) => b.distance - a.distance);
    }

    const finish = grid.getCell(gridSize - 1, gridSize - 1);
    if (isFinite(finish.distance)) {
        console.log('Dist:', finish.distance);
        console.log('Step:', steps);
        console.log(grid);
        console.log(`${input[steps].c},${input[steps].r}`);
        break;
    }
}

timer.stop();

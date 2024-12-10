//This file tests the new grid class
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

let rawInput = fs.readFileSync(
    testMode ? 'testinput.txt' : 'input.txt',
    'utf-8'
);

const myGrid = new Grid(rawInput);

let part1 = 0;
myGrid
    .getAllCells()
    .filter((cell) => cell.value === 'X')
    .forEach((cell) => {
        for (const direction of Grid.allDirections) {
            const word = cell.grid
                .getCellsFromCoordsInDirection(
                    cell.row,
                    cell.column,
                    direction,
                    4,
                    true
                )
                .map((aCell) => aCell.value)
                .join('');
            if (word === 'XMAS') part1++;
        }
    });
console.log('Part 1:', part1);

let part2 = 0;
myGrid
    .getAllCells()
    .filter((cell) => cell.value === 'A')
    .forEach((cell) => {
        let crissCrossLeters = cell
            .getCellInDirections(Grid.diagonals)
            .map((aCell) => aCell.value);
        let word1 = [crissCrossLeters[0], crissCrossLeters[2]].sort().join('');
        let word2 = [crissCrossLeters[1], crissCrossLeters[3]].sort().join('');

        if (word1 === 'MS' && word2 === 'MS') part2++;
    });
console.log('Part 2:', part2);

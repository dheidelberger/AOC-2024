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
    .trim();

let g = new Grid(input);

let regions = {};
let regionList = [];
let cells = g.getAllCells();
let regionIndex = -1;
for (const cell of cells) {
    if (cell.key in regions) {
        continue;
    }
    regionIndex++;
    let toVisit = [cell];
    let found = new Set();
    let regionVal = cell.value;
    while (toVisit.length > 0) {
        let currentCell = toVisit.pop();

        regions[currentCell.key] = regionIndex;
        found.add(currentCell.key);
        let surrounding = currentCell.getCellInDirections(
            Grid.cardinalDirections
        );
        for (const surroundingCell of surrounding) {
            if (
                !found.has(surroundingCell.key) &&
                surroundingCell.value === regionVal
            ) {
                toVisit.push(surroundingCell);
            }
        }
    }
    regionList.push(Array.from(found).map((c) => g.getCellWithKey(c)));
}

let sum = 0;
for (const region of regionList) {
    console.log(region);
    let area = region.length;
    let perimeter = region
        .map(
            (cell) =>
                cell
                    .getCellInDirections(Grid.cardinalDirections)
                    .filter((neighbor) => neighbor.value !== cell.value).length
        )
        .reduce((n, cell) => n + cell, 0);
    console.log('Area:,', area);
    console.log('Perim:', perimeter);
    sum += area * perimeter;
}
console.log(sum);
timer.stop();

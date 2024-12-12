import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const colors = require('colors/safe');
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

let colorArray = [
    colors.red,
    colors.green,
    colors.blue,
    colors.magenta,
    colors.yellow,
    colors.cyan,
];

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
        currentCell.setColor(colorArray[regionIndex % colorArray.length]);

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

console.log(g);

let sum = 0;
for (let i = 0; i < regionList.length; i++) {
    const region = regionList[i];

    console.log(region);
    let area = region.length;
    let upDownSides = 0;
    for (let r = 0; r < g.height; r++) {
        let inTopSide = false;
        let inBottomSide = false;
        for (let c = 0; c < g.width; c++) {
            let cell = g.getCell(r, c);
            if (regions[cell.key] === i) {
                let up = cell.getCellInDirection(Grid.directions.UP);
                let down = cell.getCellInDirection(Grid.directions.DOWN);
                if (up.value !== cell.value && !inTopSide) {
                    upDownSides++;
                    inTopSide = true;
                } else if (up.value === cell.value) {
                    inTopSide = false;
                }
                if (down.value !== cell.value && !inBottomSide) {
                    upDownSides++;
                    inBottomSide = true;
                } else if (down.value === cell.value) {
                    inBottomSide = false;
                }
            } else {
                inTopSide = false;
                inBottomSide = false;
            }
        }
    }
    console.log('Up/Down sides:', upDownSides);
    let leftRightSides = 0;
    for (let c = 0; c < g.width; c++) {
        let inLeftSide = false;
        let inRightSide = false;
        for (let r = 0; r < g.height; r++) {
            let cell = g.getCell(r, c);
            if (regions[cell.key] === i) {
                let left = cell.getCellInDirection(Grid.directions.LEFT);
                let right = cell.getCellInDirection(Grid.directions.RIGHT);
                if (left.value !== cell.value && !inLeftSide) {
                    leftRightSides++;
                    inLeftSide = true;
                } else if (left.value === cell.value) {
                    inLeftSide = false;
                }
                if (right.value !== cell.value && !inRightSide) {
                    leftRightSides++;
                    inRightSide = true;
                } else if (right.value === cell.value) {
                    inRightSide = false;
                }
            } else {
                inLeftSide = false;
                inRightSide = false;
            }
        }
    }
    console.log('Left/Right sides:', leftRightSides);
    let perimeter = upDownSides + leftRightSides;
    console.log('Area:,', area);
    console.log('Perim:', perimeter);
    sum += area * perimeter;
}

console.log(sum);
timer.stop();

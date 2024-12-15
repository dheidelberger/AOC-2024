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
const ROBOT = '@';
const BOX = 'O';
const WALL = '#';
const EMPTY = '.';

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n');

const grid = new Grid(input[0].trim());
const directionString = ['^', '>', 'v', '<'];
const directions = input[1]
    .trim()
    .replaceAll('\n', '')
    .split('')
    .map((direction) => {
        return {
            symbol: direction,
            vector: Grid.cardinalDirections[directionString.indexOf(direction)],
        };
    });
console.log(grid);
let robot = grid.getAllCells().filter((cell) => cell.value === ROBOT)[0];
console.log(robot);
for (const direction of directions) {
    let cells = [robot];
    let currentCell = robot;
    let stop = false;
    // console.log('Robot:');
    // console.log(robot);
    // console.log('Direction');
    // console.log(direction);
    while (!stop) {
        currentCell = currentCell.getCellInDirection(direction.vector);
        if (currentCell.value === EMPTY) {
            stop = true;
        } else if (currentCell.value === WALL) {
            cells = [];
            stop = true;
        } else {
            cells.push(currentCell);
        }
    }
    // console.log(direction);
    // console.log(cells);

    for (let i = 0; i < cells.length; i++) {
        let symbol = i === 0 ? ROBOT : BOX;
        if (i === 0) {
            cells[i].value = EMPTY;
            robot = robot.getCellInDirection(direction.vector);
        }
        cells[i].getCellInDirection(direction.vector).value = symbol;
    }
    // console.log(grid);
}

let score = 0;
grid.getAllCells()
    .filter((cell) => cell.value === BOX)
    .forEach((cell) => {
        score += cell.row * 100 + cell.column;
    });
console.log(score);

timer.stop();

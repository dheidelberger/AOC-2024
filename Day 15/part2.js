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
import { generate, generateSync } from 'text-to-image';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);
const ROBOT = '@';
const BOX = 'O';
const WALL = '#';
const EMPTY = '.';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';

const testMode = false;

function getCellsPushed(startCell, direction) {
    let pushList = [startCell];

    let currentCells = [startCell];

    let stop = false;
    while (!stop) {
        let newCells = new Set();
        for (const cell of currentCells) {
            const nextCell = cell.getCellInDirection(direction.vector);
            if (nextCell.value === WALL) {
                newCells = new Set(); //Forgot to do this. Took two hours to debug :(
                pushList = [];
                stop = true;
                break;
            } else if (nextCell.value === BOX_LEFT) {
                newCells.add(nextCell.key);
                newCells.add(
                    nextCell.getCellInDirection(Grid.directions.RIGHT).key
                );
            } else if (nextCell.value === BOX_RIGHT) {
                newCells.add(nextCell.key);
                newCells.add(
                    nextCell.getCellInDirection(Grid.directions.LEFT).key
                );
            }
        }
        if (newCells.size === 0) {
            stop = true;
            continue;
        }
        const newCellArray = [...newCells].map((cellKey) =>
            startCell.grid.getCellWithKey(cellKey)
        );
        pushList = [...pushList, ...newCellArray];
        currentCells = newCellArray;
    }
    return pushList;
}

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n');

const gridString = input[0]
    .split('\n')
    .map((row) =>
        row
            .split('')
            .map((cell) => {
                if (cell === BOX) return `[]`;
                if (cell === WALL) return '##';
                if (cell === EMPTY) return '..';
                if (cell === ROBOT) return '@.';
            })
            .join('')
    )
    .join('\n');
console.log(gridString);
const grid = new Grid(gridString);
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
console.log('Total Steps:', directions.length);
let robot = grid.getAllCells().filter((cell) => cell.value === ROBOT)[0];
robot.setColor(colors.red);
console.log(robot);
console.log(grid);
let idx = 0;
for (const direction of directions) {
    let outStr = ''; // Used for visualization to debug.
    let cells = [robot];
    // console.log(`Step: ${idx}`);
    // outStr += `Step: ${idx}\nRobot:\n${robot.row},${robot.column},${robot.value}\nDirection:\n${direction.symbol}\n`;
    // console.log('Robot:');
    // console.log(robot);
    // console.log('Direction');
    // console.log(direction);
    if (robot.value !== ROBOT) {
        console.log('The robot got out of sync');
        console.log('Step:', idx);
        process.exit(1);
    }

    if (direction.symbol === '<' || direction.symbol === '>') {
        // console.log('LR');
        let currentCell = robot;
        let stop = false;

        while (!stop) {
            currentCell = currentCell.getCellInDirection(direction.vector);
            // console.log(currentCell);
            if (currentCell.value === EMPTY) {
                // console.log('EMPTY');
                stop = true;
            } else if (currentCell.value === WALL) {
                // console.log('WALL');
                cells = [];
                stop = true;
            } else {
                // console.log('BOX');
                cells.push(currentCell);
            }
        }
        let symbols = cells.map((cell) => cell.value);
        symbols = [EMPTY, ...symbols];

        for (let i = 0; i < cells.length; i++) {
            if (i === 0) {
                // robot.setColor(null);
                robot = robot.getCellInDirection(direction.vector);
                robot.setColor(colors.red);
            }
            cells[i].value = symbols[i];
        }
        if (cells.length > 0) {
            cells[cells.length - 1].getCellInDirection(direction.vector).value =
                symbols[cells.length];
        }
    } else {
        // console.log('UD');
        cells = getCellsPushed(robot, direction);
        const originalValues = {};
        for (const cell of cells) {
            originalValues[cell.key] = cell.value;
            cell.value = EMPTY;
        }
        // console.log(cells);
        // console.log(originalValues);

        for (let i = 0; i < cells.length; i++) {
            if (i === 0) {
                cells[i].value = EMPTY;
                // robot.setColor(null);
                robot = robot.getCellInDirection(direction.vector);
                robot.setColor(colors.red);
            }
            cells[i].getCellInDirection(direction.vector).value =
                originalValues[cells[i].key];
        }
    }
    // outStr += `${grid}`;
    // let png = generateSync(outStr, {
    //     bgColor: '#000000',
    //     fontFamily: 'monospace',
    //     textColor: '#FFFFFF',
    //     fontSize: 22,
    //     maxWidth: 2000,
    // });
    // const idxString = `${idx}`.padStart(4, '0');
    // png = png.replace(/^data:image\/png;base64,/, '');

    // fs.writeFileSync(`part2_${idxString}.png`, png, 'base64');
    idx++;

    // console.log(grid);
}

let score = 0;
grid.getAllCells()
    .filter((cell) => cell.value === BOX_LEFT)
    .forEach((cell) => {
        score += cell.row * 100 + cell.column;
    });
console.log(grid);
console.log(score);

timer.stop();

// // 1334951 - too low
// 1376686

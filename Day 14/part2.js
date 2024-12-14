//Found a pattern around (i-88)%101 iterations
// Printed out a whole bunch of those grids and eventually saw a tree at i=996,554
// Guessed that as well as at 996,555 (since i starts at 0) and that was too high.
// Tried finding a pattern from the tree in every grid up to 1,000,000 but for some reason got no results including for 996,554
// Then reprinted my mod iterations and just searched the terminal for the earliest occurrence and got the answer
// Problem, in hindsight, is that I had a gridstr and a gridStr variable and I was searching the wrong one.
// Code is now revised to show that working solution.

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

const width = testMode ? 11 : 101;
const height = testMode ? 7 : 103;

const row = ' '.repeat(width);
const cells = [];

for (let i = 0; i < height; i++) {
    cells.push(row);
}

const grid = new Grid(cells.join('\n'));

let robots = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => {
        const [_, pc, pr, vc, vr] = row
            .match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/)
            .map((v) => +v);
        return {
            pc,
            pr,
            vc,
            vr,
        };
    })
    .map((robot) => {
        robot.cell = grid.getCell(robot.pr, robot.pc);
        if (robot.cell.count) {
            robot.cell.count += 1;
        } else {
            robot.cell.count = 1;
        }
        robot.cell.value = 'X';
        return robot;
    });

for (let i = 0; i < 1000000; i++) {
    if (i % 10000 === 0) {
        console.log(i);
    }
    for (const robot of robots) {
        robot.cell.count--;
        if (robot.cell.count === 0) robot.cell.value = ' ';

        robot.pc += robot.vc;
        robot.pr += robot.vr;

        while (robot.pc < 0) {
            robot.pc += width;
        }
        while (robot.pr < 0) {
            robot.pr += height;
        }

        robot.pc %= width;
        robot.pr %= height;

        robot.cell = grid.getCell(robot.pr, robot.pc);
        if (!robot.cell.count) {
            robot.cell.count = 1;
        } else {
            robot.cell.count++;
        }
        robot.cell.value = 'X';
    }
    const gridStr = grid.toString();

    if (gridStr.match(/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/)) {
        console.log(i);
        console.log(grid);
        break;
    }
    // if ((i - 88) % 101 === 0) {
    //     console.log('Iteration:', i);
    //     console.log(grid);

    //     console.log('='.repeat(width));
    // }
}
// Found at i: 8,269 - correct answer
// Found at i: 18,672
// Found at i: 29,075
// Found at i: 39,478
// Guessed: 996,554
// Guessed: 996,555 - too high

timer.stop();

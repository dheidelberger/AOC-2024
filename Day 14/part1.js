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

const row = '0'.repeat(width);

console.log(row);
let gridstr = '';
for (let i = 0; i < height; i++) {
    gridstr += row + '\n';
}
gridstr = gridstr.trim();

const grid = new Grid(gridstr, { parseAsNumbers: true });

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
        robot.cell.value += 1;
        return robot;
    });

console.log(robots);
console.log(grid);

for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
        // console.log('Robot starts at:', robot.cell);
        // console.log('Robot Velocity:', robot.vr, robot.vc);

        robot.cell.value -= 1;
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
        robot.cell.value += 1;
    }
}

console.log(robots);
console.log(grid);
const quads = [
    [0, 0],
    [0, 0],
];
const middleRowIndex = Math.floor(height / 2);
const middleColIndex = Math.floor(width / 2);
for (const robot of robots) {
    console.log(robot);

    let rowQuad = null;
    let colQuad = null;
    if (robot.pr < middleRowIndex) rowQuad = 0;
    else if (robot.pr > middleRowIndex) rowQuad = 1;
    if (robot.pc < middleColIndex) colQuad = 0;
    else if (robot.pc > middleColIndex) colQuad = 1;
    console.log('RowQuad:', rowQuad, 'ColQuad:', colQuad);
    if (rowQuad !== null && colQuad !== null) {
        quads[rowQuad][colQuad] += 1;
    }
}
console.log(quads);
console.log(
    quads.map((row) => row[0] * row[1]).reduce((prev, row) => prev * row, 1)
);

timer.stop();

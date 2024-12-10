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

console.time('Run Time');

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim();

const grid = new Grid(input);
let symbols = new Set();
grid.getAllCells().forEach((cell) => {
    if (cell.value !== '.') symbols.add(cell.value);
});

console.log(grid);
console.log(symbols);

const nodes = new Set();
for (const symbol of Array.from(symbols)) {
    console.log(symbol);
    const cells = grid.getAllCells().filter((cell) => cell.value === symbol);
    console.log(cells);
    for (let i = 0; i < cells.length; i++) {
        for (let o = i + 1; o < cells.length; o++) {
            const a = cells[i];
            const b = cells[o];
            const rSlope = b.row - a.row;
            const cSlope = b.column - a.column;
            const nodesForCombo = [];
            nodesForCombo.push(grid.getCell(a.row - rSlope, a.column - cSlope));
            nodesForCombo.push(grid.getCell(b.row + rSlope, b.column + cSlope));
            for (let node of nodesForCombo) {
                if (!node.outOfBounds) {
                    let key = `${node.row}_${node.column}`;
                    nodes.add(key);
                }
            }
        }
    }
}
console.log(nodes.size);
console.timeEnd('Run Time');

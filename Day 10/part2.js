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

let grid = new Grid(input, { parseAsNumbers: true });

console.log(grid);

let trailheads = grid.getAllCells().filter((cell) => cell.value === 0);
let solutions = 0;
let part2 = 0;
for (let trailhead of trailheads) {
    let paths = new Set();
    let toVisit = [trailhead];
    while (toVisit.length > 0) {
        const currentSquare = toVisit.pop();
        let surroundings = currentSquare
            .getCellInDirections(Grid.cardinalDirections)
            .filter((cell) => cell.value === currentSquare.value + 1);
        for (let surrounding of surroundings) {
            if (surrounding.value === 9) {
                paths.add(surrounding.key);
                part2 += 1;
                continue;
            }
            toVisit.push(surrounding);
        }
    }
    console.log(paths);
    solutions += paths.size;
}
console.log(solutions);
console.log(part2);
timer.stop();

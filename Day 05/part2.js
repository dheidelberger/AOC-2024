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

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .split('\n');
const rules = {};
let line = input[0];
let i = 0;
while (line !== '') {
    const [val, condition] = line.split('|').map((num) => +num);
    if (rules[val]) {
        rules[val].add(condition);
    } else {
        rules[val] = new Set([condition]);
    }

    i++;
    line = input[i];
}
i++;
const pageGroups = [];
for (let j = i; j < input.length; j++) {
    line = input[j];
    const vals = line.split(',').map((val) => +val);
    pageGroups.push(vals);
}

let part1 = 0;
let part2 = 0;
for (const pages of pageGroups) {
    let valid = true;

    for (let o = 0; o < pages.length; o++) {
        const page = pages[o];

        let left = new Set(pages.slice(0, o));
        if (rules[page]) {
            const rule = rules[page];

            const inters = setUtilities.intersection(left, rule);

            if (inters.size !== 0) {
                valid = false;
                break;
            }
        }
    }

    if (valid) {
        let middle = Math.floor(pages.length / 2);
        part1 += pages[middle];
    } else {
        pages.sort((a, b) => {
            if (rules[a] && rules[a].has(b)) {
                return -1;
            } else if (rules[b] && rules[b].has(a)) {
                return 1;
            } else {
                console.log(`${a} and ${b} have no relationship`);
                return 0;
            }
        });

        let middle = Math.floor(pages.length / 2);
        part2 += pages[middle];
    }
}
console.log('Part 1:', part1);
console.log('Part 2:', part2);

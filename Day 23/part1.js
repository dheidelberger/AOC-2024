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

const nodes = {};

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .forEach((row) => {
        const els = row.split('-');

        if (els[0] in nodes) {
            nodes[els[0]].add(els[1]);
        } else {
            nodes[els[0]] = new Set([els[1]]);
        }
        if (els[1] in nodes) {
            nodes[els[1]].add(els[0]);
        } else {
            nodes[els[1]] = new Set([els[0]]);
        }
    });

const sets = new Set();
for (const node of Object.keys(nodes)) {
    const nodeSet = nodes[node];
    // console.log('Node:', node, nodeSet);
    const nodeArr = Array.from(nodeSet);

    for (const el of nodeArr) {
        const elSet = nodes[el];
        // console.log('El:', el, elSet);

        const inter = setUtilities.intersection(nodeSet, elSet);
        // console.log('Intersection:', inter);
        if (inter.size >= 1) {
            for (const lastOne of Array.from(inter)) {
                const key = [node, el, lastOne].sort().join('_');
                sets.add(key);
            }
        }
    }
    // console.log();
    // console.log();
}
const triosWithT = Array.from(sets).filter(
    (trio) => trio.split('_').filter((comp) => comp[0] === 't').length > 0
);
// console.log(triosWithT);
console.log(triosWithT.length);

timer.stop();

// 2077 - not right
// 1075 - Initially searched for "contains t" not starts with

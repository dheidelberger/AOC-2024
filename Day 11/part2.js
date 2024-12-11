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

class Stone {
    constructor(number) {
        this.value = number;
    }
    blink() {
        let valueString = `${this.value}`;
        if (this.value === 0) {
            // console.log('Set to 1');
            this.value = 1;
            return;
        } else if (valueString.length % 2 === 0) {
            // console.log('Even digits');
            let left = +valueString.slice(0, valueString.length / 2);
            let right = +valueString.slice(valueString.length / 2);
            const newStone = new Stone(right);
            this.value = left;
            return newStone;
        } else {
            // console.log('Times 2024');
            this.value *= 2024;
            return;
        }
    }
}

const cache = {};

function solve(stones, steps) {
    function recurse(stone, steps) {
        let key = `${stone.value}_${steps}`;
        if (cache[key]) {
            return cache[key];
        }
        if (steps === 0) return 1;
        const result = stone.blink();
        if (result) {
            cache[key] = recurse(stone, steps - 1) + recurse(result, steps - 1);
        } else {
            cache[key] = recurse(stone, steps - 1);
        }
        return cache[key];
    }
    let sum = 0;
    for (const stone of stones) {
        sum += recurse(stone, steps);
    }
    return sum;
}

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split(' ')
    .map((num) => new Stone(+num));
const sum = solve(input, 75);
console.log(sum);

timer.stop();

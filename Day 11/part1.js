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
        this.nextStone = null;
    }
    setNext(stone) {
        this.nextStone = stone;
    }
    blink() {
        let valueString = `${this.value}`;
        if (this.value === 0) {
            // console.log('Set to 1');
            this.value = 1;
            return false;
        } else if (valueString.length % 2 === 0) {
            // console.log('Even digits');
            let left = +valueString.slice(0, valueString.length / 2);
            let right = +valueString.slice(valueString.length / 2);
            const newStone = new Stone(right);
            newStone.setNext(this.nextStone);
            this.value = left;
            this.nextStone = newStone;
            return true;
        } else {
            // console.log('Times 2024');
            this.value *= 2024;
            return false;
        }
    }
}

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split(' ')
    .map((num) => new Stone(+num));

for (let i = 0; i < input.length - 1; i++) {
    input[i].setNext(input[i + 1]);
}
console.log(input);

for (let i = 0; i < 25; i++) {
    console.log('Blink', i + 1);
    let currentStone = input[0];
    const vals = [];

    while (currentStone) {
        // console.log('Evaluating:', currentStone.value);
        const result = currentStone.blink();
        vals.push(currentStone.value);
        currentStone = currentStone.nextStone;
        if (result) {
            vals.push(currentStone.value);
            currentStone = currentStone.nextStone;
        }
    }
    console.log(vals.length);
}

timer.stop();

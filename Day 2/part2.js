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
    .split('\n')
    .map((row) => row.split(' ').map((cell) => +cell));

let count = 0;
for (const fullLevel of input) {
    console.log(fullLevel);
    let levels = [];
    levels.push(JSON.parse(JSON.stringify(fullLevel)));
    for (let i = 0; i < fullLevel.length; i++) {
        const newArr = JSON.parse(JSON.stringify(fullLevel));
        newArr.splice(i, 1);
        levels.push(newArr);
    }
    console.log(levels);
    let safes = [];
    for (const level of levels) {
        let direction = Math.sign(level[0] - level[1]);
        let safe = true;
        if (direction === 0) continue;
        for (let i = 1; i < level.length; i++) {
            let diff = level[i - 1] - level[i];
            console.log(level[i - 1], level[i], diff);
            if (diff === 0) {
                console.log('Diff is 0');
                safe = false;
                break;
            }
            if (Math.sign(diff) !== direction) {
                safe = false;
                console.log('Wrong direction');
                break;
            }
            if (Math.abs(diff) > 3) {
                console.log('Big jump');
                safe = false;
                break;
            }
        }
        safes.push(safe);
    }

    console.log(safes);
    let anySafe = false;
    for (const level of safes) {
        anySafe = anySafe || level;
    }

    if (anySafe) {
        console.log('Safe!');
        count++;
    }
}
console.log(count);

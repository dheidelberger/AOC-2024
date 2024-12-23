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

function findSets(connections) {
    let cache = {};
    function recurse(subset, nodePath) {
        const nodePathKey = Array.from(nodePath).sort().join(',');
        const subsetKey = Array.from(subset).sort().join(',');
        const cacheKey = `${subsetKey}:${nodePathKey}`;
        if (cacheKey in cache) return cache[cacheKey];
        if (subset.size === 0) {
            cache[cacheKey] = { key: nodePathKey, size: nodePath.size };
            return cache[cacheKey];
        }
        const subArr = Array.from(subset);

        let bestResult = { size: -Infinity };
        for (const el of subArr) {
            const elSet = connections[el];
            const intersect = setUtilities.intersection(subset, elSet);
            if (!nodePath.has(el)) {
                nodePath.add(el);
                const result = recurse(intersect, nodePath);
                if (result.size > bestResult.size) {
                    bestResult = result;
                }
                nodePath.delete(el);
            }
        }
        cache[cacheKey] = bestResult;
        return bestResult;
    }

    const connectionKeys = Object.keys(connections);

    let best = { size: -Infinity };
    for (let i = 0; i < connectionKeys.length; i++) {
        const node = connectionKeys[i];
        console.log(`Node ${i + 1} of ${connectionKeys.length}: ${node}`);
        const nodeSet = connections[node];
        const result = recurse(nodeSet, new Set([node]));
        if (result.size > best.size) best = result;
    }
    console.log('Best result:');
    console.log(best);
}

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

findSets(nodes);

timer.stop();

// dh,hc,id,il,iq,jn,jt,la,oe,on,rc,su,vz,we (14) - not right

// rollup.config.js
// import { globbySync as globby } from 'globby';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import json from '@rollup/plugin-json';
// import copy from 'rollup-plugin-copy'

import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json'))

// const copyOpts = {
//     targets: [
//         { src: 'src/vendor/edge-fel/edge-fel.wasm', dest: 'dist' }
//     ]
// }

export default [
    // browser-friendly builds
    {
        input: 'src/index.js',
        output: [{
            name: 'edgeML',
            file: pkg.browser['dist/index.js'], // from package.json
            format: 'iife'
        },
        {
            name: 'edgeML',
            file: pkg.browser['dist/index.esm.js'], // from package.json
            format: 'es'
        }],
        plugins: [
            // copy(copyOpts),
            nodeResolve({ preferBuiltins: true, browser: true }),
            commonjs({ transformMixedEsModules: true, include: ["src/**", "node_modules/**"], strictRequires: true }), // so Rollup can convert to ES module
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify 
    // `file` and `format` for each target)
    {
        input: 'src/index.js',
        output: [
            { file: pkg.main, format: 'cjs' }, // from package.json
            { file: pkg.module, format: 'es' } // from package.json
        ],
        plugins: [
            // copy(copyOpts),
            nodeResolve(),
            json(),
            commonjs({ transformMixedEsModules: true, include: ["src/**", "node_modules/**"], strictRequires: true }), // so Rollup can convert to ES module
        ]
    },
];
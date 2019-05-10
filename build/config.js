const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

const extensions = [ '.ts', '.js' ];

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/thumbnail.esm.js',
            format: 'esm',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/thumbnail.cjs.js',
            format: 'cjs',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/thumbnail.js',
            name: 'Thumbnail',
            format: 'umd',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                extensions,
            }),
        ],
    },
];
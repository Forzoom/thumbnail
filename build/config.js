const typescript = require('rollup-plugin-typescript');

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/thumbnail.esm.js',
            format: 'esm',
        },
        plugins: [
            typescript(),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/thumbnail.cjs.js',
            format: 'cjs',
        },
        plugins: [
            typescript(),
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
            typescript(),
        ],
    },
];
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/osk.js',
    output: {name:'GuppyOSK',
	     file:process.env.NODE_ENV === 'production' ? 'build/guppy_osk.min.js' : 'build/guppy_osk.js',
	     format: 'iife'},
    plugins: [
	commonjs({
            include: [
                'lib/katex/**'
            ]
	}),
	babel({
            exclude: 'node_modules/**',
            presets: [['es2015', { "modules": false }]]
	}),
	(process.env.NODE_ENV === 'production' && uglify()),
    ],
};

import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/guppy.js',
    output: {name:'Guppy',
	     file:process.env.NODE_ENV === 'production' ? 'build/guppy.min.js' : 'build/guppy.js',
	     format: 'iife'},
    plugins: [
	commonjs({
            include: [
                'lib/mousetrap/**',
                'lib/katex/**'
            ],
	    namedExports: { 'mousetrap': ['Mousetrap'] }
	}),
	babel({
            exclude: 'node_modules/**',
            presets: [['es2015', { "modules": false }]]
	}),
	eslint,
	(process.env.NODE_ENV === 'production' && uglify),
    ],
};

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/guppy.js',
    output: {name:'Guppy',
	     file:process.env.NODE_ENV === 'production' ? 'build/guppy.min.js' : 'build/guppy.js',
	     format: 'iife'},
    plugins: [
	resolve({
	    jsnext: true,
	    main: true,
	    browser: true,
	}),
	commonjs({
            include: [
                'node_modules/mousetrap/**',
                'node_modules/katex-modified/**'
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

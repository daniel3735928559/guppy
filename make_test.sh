mkdir test/static/build 2>/dev/null
rm test/static/build/* 2>/dev/null
./node_modules/.bin/browserify -t browserify-istanbul src/guppy.js -o test/static/build/guppy_test.js --standalone Guppy
cat lib/katex/katex-modified.min.css style/guppy.css > test/static/build/guppy-test.min.css
cp -r sym/symbols.json test/static/build/

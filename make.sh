./node_modules/.bin/browserify src/guppy.js -o build/guppy.min.js --standalone Guppy $1
./node_modules/.bin/browserify src/guppy_render.js -o build/guppy_render.min.js --standalone guppy_render $1
./node_modules/.bin/browserify src/guppy_doc.js -o build/guppy_doc.min.js --standalone GuppyDoc $1
./node_modules/.bin/browserify src/guppy_backend.js -o build/guppy_backend.min.js --standalone GuppyBackend $1
./node_modules/.bin/browserify src/guppy_osk.js -o build/guppy_osk.js --standalone GuppyOSK $1
cat lib/katex/katex-modified.min.css > build/guppy-none.min.css
cat lib/katex/katex-modified.min.css style/guppy.css > build/guppy-default.min.css
cat lib/katex/katex-modified.min.css style/guppy.css style/osk.css > build/guppy-default-osk.min.css
cp -r lib/katex/fonts build
cp -r icons/ build

mkdir test/static/build 2>/dev/null
rm test/static/build/* 2>/dev/null
./node_modules/.bin/browserify -t browserify-istanbul src/guppy.js -o test/static/build/guppy_test.js --standalone Guppy
cat lib/katex/katex-modified.min.css style/guppy.css > test/static/build/guppy-test.min.css
cp -r sym/symbols.json test/static/build/

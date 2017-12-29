./node_modules/.bin/browserify src/guppy.js -o build/guppy.min.js --standalone Guppy $1
./node_modules/.bin/browserify src/osk.js -o build/guppy_osk.js --standalone GuppyOSK $1
cat lib/katex/katex-modified.min.css > build/guppy-none.min.css
cat lib/katex/katex-modified.min.css style/guppy.css > build/guppy-default.min.css
cat lib/katex/katex-modified.min.css style/guppy.css style/osk.css > build/guppy-default-osk.min.css
cp -r lib/katex/fonts build
cp -r icons/ build

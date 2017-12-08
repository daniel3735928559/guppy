./node_modules/.bin/browserify src/guppy.js -o build/guppy.min.js --standalone Guppy $1
./node_modules/.bin/browserify src/guppy_render.js -o build/guppy_render.min.js --standalone guppy_render $1
./node_modules/.bin/browserify src/guppy_doc.js -o build/guppy_doc.min.js --standalone GuppyDoc $1
./node_modules/.bin/browserify src/guppy_backend.js -o build/guppy_backend.min.js --standalone GuppyBackend $1
cp src/guppy_osk.js build/guppy_osk.js
cat lib/katex/katex-modified.min.css > build/guppy-none.min.css
cat lib/katex/katex-modified.min.css style/guppy.css > build/guppy-default.min.css
cat lib/katex/katex-modified.min.css style/guppy.css style/osk.css > build/guppy-default-osk.min.css
cp -r lib/katex/fonts build
cp -r icons/ build
browserify src/guppy.js -o build/guppy.min.js --standalone Guppy $1
browserify src/guppy_render.js -o build/guppy_render.min.js --standalone guppy_render $1
browserify src/guppy_doc.js -o build/guppy_doc.min.js --standalone GuppyDoc $1
browserify src/guppy_backend.js -o build/guppy_backend.min.js --standalone GuppyBackend $1
cp lib/katex/katex-modified.min.css build/guppy.min.css
cp -r lib/katex/fonts build

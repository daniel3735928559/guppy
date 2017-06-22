browserify src/guppy.js -o build/guppy.min.js --standalone Guppy $1
browserify src/guppy_doc.js -o build/guppy_doc.min.js --standalone GuppyDoc $1
browserify src/guppy_editor.js -o build/guppy_editor.min.js --standalone GuppyEditor $1
cp lib/katex/katex-modified.min.css build/guppy.min.css
cp -r lib/katex/fonts build

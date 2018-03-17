op="$1"

case "$op" in
    "build-debug")
	[[ ! -d build ]] && mkdir build
	./node_modules/.bin/browserify src/guppy.js -o build/guppy.min.js --standalone Guppy -d
	./node_modules/.bin/browserify src/osk.js -o build/guppy_osk.js --standalone GuppyOSK -d
	cat lib/katex/katex-modified.min.css > build/guppy-none.min.css
	cat lib/katex/katex-modified.min.css style/guppy.css > build/guppy-default.min.css
	cat lib/katex/katex-modified.min.css style/guppy.css style/osk.css > build/guppy-default-osk.min.css
	cp -r lib/katex/fonts build
	cp -r lib/icons/ build
	;;
    "deploy")
	npm run-script build
	cp deploy.json build/package.json
	cd build
	npm deploy
	;;
    "build-final")
	[[ ! -d build ]] && mkdir build
	./node_modules/.bin/browserify src/guppy.js --standalone Guppy | ./node_modules/.bin/uglifyjs --mangle --beautify ascii_only=true,beautify=false > build/guppy.min.js
	./node_modules/.bin/browserify src/osk.js --standalone GuppyOSK | ./node_modules/.bin/uglifyjs --mangle --beautify ascii_only=true,beautify=false  > build/guppy_osk.js
	./node_modules/.bin/uglifycss lib/katex/katex-modified.min.css > build/guppy-none.min.css
	./node_modules/.bin/uglifycss lib/katex/katex-modified.min.css style/guppy.css > build/guppy-default.min.css
	./node_modules/.bin/uglifycss lib/katex/katex-modified.min.css style/guppy.css style/osk.css > build/guppy-default-osk.min.css
	cp -r lib/katex/fonts build
	cp -r lib/icons/ build
	;;
    "build-test")
	mkdir test/static/build 2>/dev/null
	rm test/static/build/* 2>/dev/null
	./node_modules/.bin/browserify -t browserify-istanbul src/guppy.js -o test/static/build/guppy_test.js --standalone Guppy
	cat lib/katex/katex-modified.min.css style/guppy.css > test/static/build/guppy-test.min.css
	cp -r sym/symbols.json test/static/build/
	cp -r lib/katex/fonts test/static/build/
	cp -r lib/icons/ test/static/build/
	;;
    "test")
	cd test
	echo Starting server...
	node test_server.js | tee /tmp/guppy-test-output | node web.js &
	npid=`jobs -p`
	echo Waiting for done signal...
	while [[ "$(grep -c DONE /tmp/guppy-test-output)" -lt 1 ]]; do printf '.'; sleep 1; done
	echo ""
	echo Downloading coverage results...
	rm -rf cover/*
	curl -s -L -o cover/coverage.zip http://localhost:8778/coverage/download
	echo Killing server...
	kill $npid
	rm /tmp/guppy-test-output
	echo "Results in coverage.zip"
	cd cover
	unzip coverage.zip
	cd ../../
	;;
    *)
	echo "Usage: dev.sh deploy|build-debug|build-final|build-test|test"
	;;
esac

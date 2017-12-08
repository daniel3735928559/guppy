cd test
echo Starting server...
node test_server.js > /tmp/guppy-test-output &
npid=$!
echo Starting browser...
node web.js &
echo Waiting for done signal...
while [[ $(grep -c DONE /tmp/guppy-test-output) -lt 1 ]]; do printf '.'; sleep 1; done
echo ""
echo Downloading coverage results...
rm -rf coverage/*
curl -s -L -o coverage/coverage.zip http://localhost:8778/coverage/download
echo Killing server...
kill $npid
rm /tmp/guppy-test-output
echo "Results in coverage.zip"
cd coverage
unzip coverage.zip
cd ../../

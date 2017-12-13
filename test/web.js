var selenium = require('selenium-webdriver');
var stdin = process.openStdin();
stdin.on('data', function(chunk) { done(); });
var driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
var done = function(){
    console.log("finished");
    driver.quit();
}
driver.get('http://localhost:8778/index.html');

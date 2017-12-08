var selenium = require('selenium-webdriver');

var driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
var done = function(){
    console.log("finished");
    driver.quit();
}
driver.get('http://localhost:8778/test.html').then(function(){setTimeout(done,20000)});

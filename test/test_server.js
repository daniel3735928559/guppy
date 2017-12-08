var coverage = require('istanbul-middleware');
var express = require('express');
var app = express();

app.use('/coverage', coverage.createHandler());
app.use(express.static('static'));
app.get('/done', function (req, res) { console.log("DONE"); })

app.listen(8778);

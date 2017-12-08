var coverage = require('istanbul-middleware');
var express = require('express');
var app = express();

app.use('/coverage', coverage.createHandler());
app.use(express.static('test'));

app.listen(8778);

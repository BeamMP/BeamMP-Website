// Define all Items we require
var express         = require('express');
var express         = require('express');
var bodyParser = require('body-parser');

const chalk        = require('chalk');
const error        = chalk.bold.keyword('red');
const warn         = chalk.keyword('orange');
const good         = chalk.keyword('lime');

// Setup Webserver
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PROXY HANDLING
app.set('trust proxy', true);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('static'))

app.set("views", "./views")

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
	res.render('index');
});

var routes = require('./app/routes.js');
app.use('/', routes);

app.get('/builds/launcher', function(req, res) {
	if (req.query.download == 'true') {
		const file = `${__dirname}/builds/launcher/launcher.exe`;
		res.download(file); // Set disposition and send it.
	} else if (req.query.version == 'true') {
		const file = `${__dirname}/builds/launcher/version.json`;
		res.download(file); // Set disposition and send it.
	} else {
		//res.sendStatus(403)
		res.send("Not Found!")
	}
});

app.get('/builds/server', function(req, res) {
	console.log(req.params)
	const file = `${__dirname}/builds/server/server.zip`;
	res.download(file); // Set disposition and send it.
});

app.listen(3599);
console.log('3599 is the magic port');

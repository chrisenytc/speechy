var _ = require('lodash');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var responseTime = require('response-time');
var requestId = require('request-id/express');
var methodOverride = require('method-override');

var env = process.env.NODE_ENV || 'development';
var routes = require('./endpoints/recognition');

// Get config file
var defaultConfig = require(path.join(process.cwd(), 'config', 'default'));

// Merge default config file with environment config file
_.merge(defaultConfig, require(path.join(process.cwd(), 'config', env)));

var app = express();

app.use(logger('combined'));
app.use(responseTime());
app.use(requestId());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

//Config middleware
app.use(function(req, res, next) {
	req.configs = defaultConfig;
	return next();
});

// Parse header
app.use(function(req, res, next) {
	if(req.headers['x-api-key']) {
		req.query.api_key = req.headers['x-api-key'];
	}
	return next();
});

// Authentication
app.use(function(req, res, next) {
	if(req.query.api_key && req.query.api_key == req.configs.auth.token) {
		return next();
	}
	return res.status(403).json({ error: 'Unauthorized!' });
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error(req.configs.errors.notFound.message);
	res.status = 404;
	return res.json({
		error: err.message
	});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	return res.json({
		message: req.configs.errors.serverError.message,
		error: {}
	});
});

module.exports = app;

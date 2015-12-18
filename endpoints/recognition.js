var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var cuid = require('cuid');
var express = require('express');
var request = require('request');
var speech = require('google-speech-api');
var router = express.Router();

/* GET Welcome resource */
router.get('/', function(req, res) {
	return res.json({
		message: req.configs.messages.welcome.message,
		documentation_url: req.configs.messages.documentation_url.message
	});
});

/* POST recognition endpoint */
router.post('/recognition', function(req, res, next) {

	if(!req.body.url) {
		return res.status(400).json({
			error: req.configs.errors.required.message
		});
	}

	var regex = new RegExp('^https://api.twilio.com/2010-04-01/');

	if(!regex.test(req.body.url)) {
		return res.status(400).json({
			error: req.configs.errors.invalid.message
		});
	}

	var output = path.join(req.configs.temp_dir, cuid() + '.wav');
	var stream = fs.createWriteStream(output);

	request
	.get(req.body.url)
	.on('error', function errorHandler(err) {
		return res.status(500).json({ message: req.configs.errors.fail.message });
	})
	.on('end', function handler(apiRes) {
		speech({
			file: output,
			key: req.configs.speech.key,
			lang: req.body.locale || req.configs.speech.lang,
			maxResults: req.configs.speech.max_results
		}, function (err, results) {
			if(err || !results) {
				return res.status(500).json({ message: req.configs.errors.unknow.message });
			}

			fs.unlinkSync(output);

			console.log('Speech API output =>');
			console.log(JSON.stringify(results));

			return res.status(200).json({
				transcripts: _.get(results, '[0].result.[0].alternative') || []
			});
		});
	})
	.pipe(stream);
});

module.exports = router;

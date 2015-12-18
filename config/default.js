
module.exports = {
	temp_dir: process.env.TEMP_DIR || '/tmp/rescuer/',
	speech: {
		key: process.env.GOOGLE_SPEECH_KEY || '',
		lang: process.env.GOOGLE_SPEECH_LANGUAGE || 'pt-BR',
		max_results: process.env.GOOGLE_SPEECH_MAX_RESULTS || '1'
	},
	auth: {
		token: process.env.AUTH_TOKEN || ''
	},
	messages: {
		welcome: {
			message: 'Welcome to the Speechy Recognition API.'
		},
		documentation_url: {
			message: 'https://github.com/chrisenytc/speechy/#documentation'
		}
	},
	errors: {
		serverError: {
			message: 'An error has occurred!'
		},
		notFound: {
			message: 'Page not found.'
		},
		required: {
			message: 'The parameter \'url\' is required!'
		},
		invalid: {
			message: 'Invalid url.'
		},
		fail: {
			message: 'An error has occurred when try to download the audio file!'
		},
		unknow: {
			message: 'Unable to decode the audio!'
		}
	}
}


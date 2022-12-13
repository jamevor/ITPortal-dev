module.exports = {
	400: {
		status: 400,
		name: 'Bad Request',
		message: ''
	},
	403: {
		status: 403,
		name: 'Forbidden',
		message: 'You do not have the necessary permissions to view this page.'
	},
	404: {
		status: 404,
		name: 'Page Not Found',
		message: 'The page you are looking for does not appear to exist on our server.'
	},
	500: {
		status: 500,
		name: 'Congratulations! You\'ve found our secret page',
		message: 'We never said it was a good secret.'
	}
};
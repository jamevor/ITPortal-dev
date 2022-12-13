module.exports = class Router {
	constructor() {
		// this._agent = agent;
	}

	render(req, res, next) {
		return res.send('hello from router');
	}
};
const Manageable = require('./Manageable');
const Router = require('./Router');

module.exports = class Intro extends Manageable {
	constructor({name = 'InTRo'} = {}, config) {
		super(config);
		this.name = name;
		this._router = new Router();
	}

	ask(input) {
		return new Promise((resolve, reject) => {
			this.process(input).then(result => {
				if (result === false) {
					// TODO try algolia
					resolve(false);
					return null;
				} else {
					resolve(result);
					return null;
				}
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	// delegate
	render(req, res, next) {
		return this._router.render(req, res, next);
	}

};

const { NlpManager } = require('node-nlp');
const path = require('path');

module.exports = class Manageable {
	/**
	 * @constructor Manageable.
	 * @param {Boolean} resave whether or not to automatically resave when training.
	 * @param {String} filename where to save the trained model.
	 * @param {Number} tolerance [0-1] required level of confidence for determining intents.
	 */
	constructor({ resave = false, filename = 'intro.nlp', tolerance = 0.7, log = false, useNoneFeature = true } = {}) {
		this.resave = resave;
		this.filename = filename;
		this.tolerance = tolerance;
		this._brain = new NlpManager({ languages: ['en'], nlu: { log, useNoneFeature } });
	}

	/**
	 * @param {Array} NLPData utterances training data.
	 * @param {Array} NLGData answers training data.
	 */
	train({NLPData, NLGData}) {
		if (!(Array.isArray(NLPData) && Array.isArray(NLGData))) {
			return Promise.reject('data must be array');
		}

		for (const utterance of NLPData) {
			this._brain.addDocument(utterance.lang, utterance.phrase, utterance.intent);
		}
		for (const answer of NLGData) {
			this._brain.addAnswer(answer.lang, answer.intent, answer.response);
		}
		return (async() => {
			await this._brain.train();

			if (this.resave) {
				this.save();
			}
			return true;
		})();

	}

	save(filename = this.filename) {
		this._brain.save(path.join(__dirname, filename));
	}

	load(filename = this.filename) {
		this._brain.load(path.join(__dirname, filename));
	}

	process(input, tolerance = this.tolerance) {
		return (async() => {
			const result = await this._brain.process(input);
			// console.log(JSON.stringify(result, null, 2));
			if (tolerance <= result.score && result.intent !== 'None') {
				return result.intent;
			} else {
				return false;
			}
		})();
	}

};
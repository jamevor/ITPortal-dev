const getInclusive = require('../../config.js').getInclusive;
const request = require('request');
const requestPromise = require('request-promise-native');
const jar = request.jar();
const logger = require('../logger.js');
const moment = require('moment');

module.exports = class WorkdayAPI {
	constructor() {
		this.baseURLReg = 'https://api.getinclusive.com/prod';
		this.xapiKey = getInclusive.xapikey
		this.methods = {
			GET: 'GET',
			POST: 'POST'
		};
	}
	/**
	 * g
	 * @param {String} 
	 * @return {Promise<Object>} 
	 */
	getUserStatus(ID) {
		const qs = {
			'user_uid':ID
		}
		return makeARequest(this.methods.GET, '/status', this.baseURLReg, qs);
	}

}
function makeARequest(method, url, baseUrl, qs, form) {
	return requestPromise(
			{
				method,
				baseUrl,
				url,
				qs,
				form,
				jar,
				headers: {
					'Cache-Control': 'no-cache',
					'x-api-key': getInclusive.xapikey
				}
			}
		)
}

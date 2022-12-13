const URL = require('url');
const config = require('../../config.js');
const sanitizeHTML = require('sanitize-html');
const UserOauth = require('../../models/UserOauth.js');
const request= require('request');
const jar = request.jar();
const moment = require('moment');

const BASE = 'https://graph.microsoft.com';

module.exports = {
	authorize: (req, res, next) => {
		req.session['azure-referrer'] = sanitizeHTML(typeof req.get('Referrer') !== 'undefined' && req.get('Referrer') !== 'undefined' ? req.get('Referrer') : '/', config.sanitizeHTML.allowNone);
		const url = URL.format(
			{
				protocol: 'https',
				hostname: 'login.microsoftonline.com',
				pathname: `/${process.env.AZURE_OAUTH_TENANT_ID}/oauth2/v2.0/authorize`,
				query: {
					client_id: process.env.AZURE_OAUTH_CLIENT_ID,
					response_type: 'code',
					redirect_uri: process.env.AZURE_OAUTH_CALLBACK_URL,
					response_mode: 'query',
					scope: process.env.AZURE_OAUTH_SCOPE
				}
			}
		);
		res.redirect(url.toString());
		return null;
	},
	oauthCallback: (req, res, next) => {
		const { code } = req.query;
		if (!code) {
			next(400);
			return null;
		} else {
			UserOauth.findOrBuild(
				{
					where: {
						idUser: req.user.id,
						type: 'azure'
					}
				}
			).then(async([userOauth]) => {
				userOauth.code = code;
				await userOauth.save();
				await UserOauth.getToken(req.user.id, 'azure'); // initialize token and get refresh token
				const redirectLocation = req.session['azure-referrer'];
				delete req.session['azure-referrer'];
				req.session.save(err => {
					if (err) {
						return next(err);
					}
					if (typeof redirectLocation !== 'undefined' && redirectLocation !== 'undefined') {
						return res.redirect(redirectLocation);
					} else {
						return res.redirect('/');
					}
				});
			}).catch(err => {
				next(err);
				return null;
			});
		}
	},
	getMyMessages: (req, res, next) => {
		UserOauth.getToken(req.user.id, 'azure').then(async token => {
			if (token.success) {
				const { access_token } = token;
				const resp = await makeARequest('GET', '/v1.0/me/messages', access_token);
				res.json(resp);
			} else {
				res.status(400).json(
					{
						success: false,
						reason: 'token fetch unsuccessful'
					}
				);
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMyRecentFiles: (req, res, next) => {
		UserOauth.getToken(req.user.id, 'azure').then(async token => {
			if (token.success) {
				const { access_token } = token;
				const { value } = await makeARequest('GET', '/v1.0/me/drive/recent', access_token);
				res.json(value);
			} else {
				res.status(400).json(
					{
						success: false,
						reason: 'token fetch unsuccessful'
					}
				);
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMySchedule: (req, res, next) => {
		UserOauth.getToken(req.user.id, 'azure').then(async token => {
			if (token.success) {
				const { access_token } = token;
				const { value } = await makeARequest('GET', `/v1.0/me/calendarview?startdatetime=${moment().local().startOf('day').subtract(1, 'day').toISOString()}&enddatetime=${moment().local().add(1, 'day').endOf('day').toISOString()}`, access_token);
				value.sort((a, b) => {
					if (moment.utc(a.start.dateTime).isBefore(moment.utc(b.start.dateTime))) {
						return -1;
					} else {
						return 1;
					}
				});
				res.json(value);
			} else {
				res.status(400).json(
					{
						success: false,
						reason: 'token fetch unsuccessful'
					}
				);
			}
		}).catch(err => {
			next(err);
			return null;
		});
	}
};

function makeARequest(method, path, access_token, form) {
	return new Promise((resolve, reject) => {
		request(
			{
				url: BASE + path,
				jar,
				method,
				form,
				headers: {
					'Cache-Control': 'no-cache',
					'Authorization': `Bearer ${access_token}`
				}
			}, async(err, response, body) => {
				if (err || response.headers['content-type'].includes('html')) {
					// logger.err(`error refreshing ${type} token for idUser ${idUser}`);
					reject(err);
				} else {
					try {
						resolve(JSON.parse(body));
					} catch (err2) {
						reject(err2);
					}
				}
			}
		);
	});
}
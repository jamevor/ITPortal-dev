const URL = require('url');
const config = require('../../config.js');
const sanitizeHTML = require('sanitize-html');
const UserOauth = require('../../models/UserOauth.js');
const request= require('request');
const jar = request.jar();

const BASE = 'https://wpi.instructure.com';

module.exports = {
	authorize: (req, res, next) => {
		req.session['canvas-referrer'] = sanitizeHTML(typeof req.get('Referrer') !== 'undefined' && req.get('Referrer') !== 'undefined' ? req.get('Referrer') : '/', config.sanitizeHTML.allowNone);
		const url = URL.format(
			{
				protocol: 'https',
				hostname: 'canvas.wpi.edu',
				pathname: '/login/oauth2/auth',
				query: {
					client_id: process.env.CANVAS_OAUTH_CLIENT_ID,
					response_type: 'code',
					redirect_uri: process.env.CANVAS_OAUTH_CALLBACK_URL
				}
			}
		);
		res.redirect(url.toString());
		return null;
	},
	oauthCallback: (req, res, next) => {
		const { code, error } = req.query;
		if (error) {
			if (error === 'access_denied') {
				return res.redirect('/');
			}
		}
		if (!code) {
			next(400);
			return null;
		} else {
			UserOauth.findOrBuild(
				{
					where: {
						idUser: req.user.id,
						type: 'canvas'
					}
				}
			).then(async([userOauth]) => {
				userOauth.code = code;
				userOauth.isBroken = false;
				userOauth.access_token = null;
				userOauth.refresh_token = null;
				userOauth.expires_at = null;
				await userOauth.save();
				await UserOauth.getToken(req.user.id, 'canvas'); // initialize token and get refresh token
				const redirectLocation = req.session['canvas-referrer'];
				delete req.session['canvas-referrer'];
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
	getUserTasks: (req, res, next) => {
		UserOauth.getToken(req.user.id, 'canvas').then(async token => {
			if (token.success) {
				const { access_token } = token;
				const resp = await makeARequest('GET', '/api/v1/users/self/todo', access_token);
				const courses = await makeARequest('GET', '/api/v1/users/self/favorites/courses', access_token);
				const colors = await makeARequest('GET', '/api/v1/users/self/colors', access_token);
				for (const course of courses) {
					course.user_color = colors.custom_colors[`course_${course.id}`];
				}
				res.json({todos: resp, courses});
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
	getUserFavoriteCourses: (req, res, next) => {
		UserOauth.getToken(req.user.id, 'canvas').then(async token => {
			if (token.success) {
				const { access_token } = token;
				const courses = await makeARequest('GET', '/api/v1/users/self/favorites/courses?include[]=course_image', access_token);
				const colors = await makeARequest('GET', '/api/v1/users/self/colors', access_token);
				for (const course of courses) {
					course.user_color = colors.custom_colors[`course_${course.id}`];
				}
				res.json(courses);
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
					reject(err);
				} else if (response.statusCode === 401) {
					reject(401);
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

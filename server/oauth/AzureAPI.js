const request= require('request');
const jar = request.jar();

const BASE = 'https://graph.microsoft.com';

module.exports = {
	getUserProfile: access_token => {
		return new Promise(async(resolve, reject) => {
			try {
				const resp = await makeARequest('GET', '/v1.0/me/', access_token);
				resolve(resp);
				return null;
			} catch (err) {
				reject(err);
				return null;
			}
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
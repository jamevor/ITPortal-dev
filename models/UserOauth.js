'use strict';
const logger = require('../server/logger.js');
const request= require('request');
const jar = request.jar();
const moment = require('moment');
const crypto = require('crypto');
const CanvasAPI = require('../server/oauth/CanvasAPI.js');
const AzureAPI = require('../server/oauth/AzureAPI.js');

module.exports = class UserOauth extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			type: {
				type: DataTypes.STRING,
				primaryKey: true,
				values: ['azure', 'canvas']
			},
			code: DataTypes.STRING(5000),
			access_token: DataTypes.STRING(5000),
			refresh_token: DataTypes.STRING(5000),
			expires_at: DataTypes.DATE,
			isBroken: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'userOauth',
			tableName: 'userOauth',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				},
				{
					unique: true,
					fields: ['idUser', 'type']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
	}

	static getToken(idUser, type) {
		return new Promise((resolve, reject) => {
			UserOauth.findOne(
				{
					where: {
						idUser,
						type
					}
				}
			).then(async userOauth => {
				if (userOauth && userOauth.code) {
					// user has consented before
					const isValid = await userOauth.isValid();
					if (userOauth.access_token && moment(userOauth.expires_at).isAfter(moment()) && !userOauth.isBroken && isValid) {
						// valid token exists
						resolve(
							{
								success: true,
								response_type: 'cache',
								type,
								access_token: decrypt(userOauth.access_token)
							}
						);
						return null;
					} else {
						// token expired or doesn't exist yet or is invalid
						if (userOauth.refresh_token) {
							// refresh token
							UserOauth.refreshToken(idUser, type, { refresh_token: decrypt(userOauth.refresh_token) }).then(result => {
								const { access_token, expires_in, refresh_token } = result;
								if (!access_token) {
									resolve(
										{
											success: false,
											reason: 'unable to refresh token'
										}
									);
								}
								const expires_at = moment().add(expires_in, 'seconds');
								UserOauth.update(
									{
										access_token: encrypt(access_token),
										refresh_token: refresh_token ? encrypt(refresh_token) : userOauth.refresh_token, // replace with new refresh token if the Oauth2 service gave us one.
										expires_at,
										isBroken: false
									},
									{
										where: {
											idUser,
											type
										}
									}
								).then(() => {
									resolve(
										{
											success: true,
											response_type: 'refresh',
											type,
											access_token
										}
									);
									return null;
								}).catch(err => {
									resolve(
										{
											success: false,
											type,
											reason: err
										}
									);
									return null;
								});
							}).catch(err => {
								resolve(
									{
										success: false,
										type,
										reason: err
									}
								);
								return null;
							});
						} else {
							// get token for the first time, but we already have consent
							UserOauth.fetchToken(idUser, type, { code: userOauth.code }).then(result => {
								const { access_token, expires_in, refresh_token } = result;
								if (!access_token) {
									resolve(
										{
											success: false,
											reason: 'unable to fetch token'
										}
									);
								}
								const expires_at = moment().add(expires_in, 'seconds');
								UserOauth.update(
									{
										access_token: encrypt(access_token),
										refresh_token: encrypt(refresh_token),
										expires_at,
										isBroken: false
									},
									{
										where: {
											idUser,
											type
										}
									}
								).then(() => {
									resolve(
										{
											success: true,
											response_type: 'fetch',
											type,
											access_token
										}
									);
									return null;
								}).catch(err => {
									resolve(
										{
											success: false,
											type,
											reason: err
										}
									);
									return null;
								});
							}).catch(err => {
								resolve(
									{
										success: false,
										type,
										reason: err
									}
								);
								return null;
							});
						}
					}
				} else {
					// user has not consented yet
					resolve(
						{
							success: false,
							type,
							reason: 'consent'
						}
					);
					return null;
				}
			}).catch(err => {
				resolve(
					{
						success: false,
						type,
						reason: err
					}
				);
				return null;
			});
		});
	}

	isValid() {
		return new Promise(async(resolve) => {
			switch (this.type) {
				case 'hub':
					resolve(true);
					return null;
				case 'canvas':
					if (!this.access_token) {
						resolve(false);
						return null;
					}
					try {
						const profile = await CanvasAPI.getUserProfile(decrypt(this.access_token));
						if (profile) {
							await UserOauth.setIsBroken(this.idUser, 'canvas', false);
						}
						resolve(true);
						return null;
					} catch (err) {
						if (err === 401) {
							return UserOauth.setIsBroken(this.idUser, 'canvas', true).then(() => {
								resolve(false);
								return null;
							}).catch(() => {
								resolve(false);
								return null;
							});
						} else {
							resolve(false);
							return null;
						}
					}
				case 'azure':
					if (!this.access_token) {
						resolve(false);
						return null;
					}
					try {
						const profile = await AzureAPI.getUserProfile(decrypt(this.access_token));
						if (profile) {
							await UserOauth.setIsBroken(this.idUser, 'azure', false);
						}
						resolve(true);
						return null;
					} catch (err) {
						if (err === 401) {
							return UserOauth.setIsBroken(this.idUser, 'azure', true).then(() => {
								resolve(false);
								return null;
							}).catch(() => {
								resolve(false);
								return null;
							});
						} else {
							resolve(false);
							return null;
						}
					}
			}
		});
	}

	static setIsBroken(idUser, type, isBroken) {
		return UserOauth.update(
			{
				isBroken
			},
			{
				where: {
					idUser,
					type
				}
			}
		);
	}

	static fetchToken(idUser, type, data) {
		return new Promise((resolve, reject) => {
			let url, form;
			switch (type) {
				case 'azure':
					url = `https://login.microsoftonline.com/${process.env.AZURE_OAUTH_TENANT_ID}/oauth2/v2.0/token`;
					form = {
						grant_type: 'authorization_code',
						client_id: process.env.AZURE_OAUTH_CLIENT_ID,
						client_secret: process.env.AZURE_OAUTH_CLIENT_SECRET,
						scope: process.env.AZURE_OAUTH_SCOPE,
						requested_token_use: 'on_behalf_of',
						redirect_uri: process.env.AZURE_OAUTH_CALLBACK_URL,
						code: data.code
					};
					break;
				case 'canvas':
					url = 'https://canvas.wpi.edu/login/oauth2/token';
					form = {
						grant_type: 'authorization_code',
						client_id: process.env.CANVAS_OAUTH_CLIENT_ID,
						client_secret: process.env.CANVAS_OAUTH_CLIENT_SECRET,
						redirect_uri: process.env.CANVAS_OAUTH_CALLBACK_URL,
						code: data.code
					};
					break;
				default:
					reject(`invalid type: ${type}`);
					break;
			}
			request(
				{
					url,
					jar,
					method: 'POST',
					form,
					headers: {
						'Cache-Control': 'no-cache',
					}
				}, async(err, response, body) => {
					if (err || response.headers['content-type'].includes('html')) {
						logger.err(`error fetching ${type} token for idUser ${idUser}`);
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

	static refreshToken(idUser, type, data) {
		return new Promise((resolve, reject) => {
			let url, form;
			switch (type) {
				case 'azure':
					url = `https://login.microsoftonline.com/${process.env.AZURE_OAUTH_TENANT_ID}/oauth2/v2.0/token`;
					form = {
						grant_type: 'refresh_token',
						client_id: process.env.AZURE_OAUTH_CLIENT_ID,
						client_secret: process.env.AZURE_OAUTH_CLIENT_SECRET,
						scope: process.env.AZURE_OAUTH_SCOPE,
						refresh_token: data.refresh_token
					};
					break;
				case 'canvas':
					url = 'https://canvas.wpi.edu/login/oauth2/token';
					form = {
						grant_type: 'refresh_token',
						client_id: process.env.CANVAS_OAUTH_CLIENT_ID,
						client_secret: process.env.CANVAS_OAUTH_CLIENT_SECRET,
						redirect_uri: process.env.CANVAS_OAUTH_CALLBACK_URL,
						refresh_token: data.refresh_token
					};
					break;
				default:
					reject(`invalid type: ${type}`);
					break;
			}
			request(
				{
					url,
					jar,
					method: 'POST',
					form,
					headers: {
						'Cache-Control': 'no-cache',
					}
				}, async(err, response, body) => {
					if (err || response.headers['content-type'].includes('html')) {
						logger.err(`error refreshing ${type} token for idUser ${idUser} - ${err}`);
						this.setIsBroken(idUser,type,true)
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
};

function encrypt(str) {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.AES_ENCRYPTION_KEY), iv);

	let encrypted = cipher.update(str);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(str) {
	const textParts = str.split(':');
	const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.AES_ENCRYPTION_KEY), iv);

	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}

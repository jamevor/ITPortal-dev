'use strict';
const cherwellConfig = require('../config.js').cherwell;
const logger = require('../server/logger.js');
const crypto = require('crypto');
const request= require('request');
const jar = request.jar();
const moment = require('moment');

module.exports = class CherwellTokenCache extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			token: DataTypes.STRING(2000)
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'cherwellTokenCache',
			tableName: 'cherwellTokenCache',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static async getToken() {
		if (!(await CherwellTokenCache.isTokenValid())) {
			try {
				await CherwellTokenCache.refreshToken();
			} catch (err) {
				logger.warn('error refreshing token in getToken()');
				throw err;
			}
		}
		return CherwellTokenCache.findOne(
			{
				order: [
					['id', 'DESC']
				]
			}
		).then(cherwellTokenCache => {
			return JSON.parse(decrypt(cherwellTokenCache.token))['access_token'];
		}).catch(err => {
			throw err;
		});
	}
	static async getTokens(limit) {
		
		return CherwellTokenCache.findAll(
			{
				order: [
					['id', 'DESC']
				],
				limit: limit
			}
		).then(cherwellTokenCache => {
			for(let tokenItem of cherwellTokenCache){
				tokenItem.token = JSON.parse(decrypt(tokenItem.token))
			}
			return cherwellTokenCache;
		}).catch(err => {
			throw err;
		});
	}
	static isTokenValid() {
		return new Promise((resolve, reject) => {
			CherwellTokenCache.findOne(
				{
					order: [
						['id', 'DESC']
					]
				}
			).then(cherwellTokenCache => {
				if (cherwellTokenCache) {
					var token = JSON.parse(decrypt(cherwellTokenCache.token))
					try {
						var tokenValidFor = moment(token['.expires']).diff(moment(),'minutes');
						// logger.info('Token is still valid for ' + tokenValidFor + ' minutes. YAY!');
						resolve(typeof token !== 'undefined' && token !== null && token['.expires'] && moment(token['.expires']).isAfter(moment()));
					} catch (err) {
						logger.warn(`error decrypting cherwell token: ${err}`);
						resolve(false);
					}
				} else {
					resolve(false);
				}
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	static setToken(token) {
		if (!token) {
			return Promise.resolve({});
		}
		return new Promise((resolve, reject) => {
			CherwellTokenCache.findOrCreate(
				{
					where: {
						token: encrypt(token)
					}
				}
			).then(([cherwellTokenCache]) => {
				resolve(cherwellTokenCache);
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	static refreshToken() {
		return new Promise((resolve, reject) => {
			const url = 'https://wpi.cherwellondemand.com/CherwellAPI/token';
			request(
				{
					url,
					jar,
					method: 'POST',
					form: {
						grant_type: 'password',
						...cherwellConfig
					},
					headers: {
						'Cache-Control': 'no-cache',
					}
				}, async(err, response, body) => {
					if (err) {
						try {
							await CherwellTokenCache.setToken(null);
							logger.err(`error refreshing Cherwell token: ${err}`);
							reject(err);
						} catch (err2) {
							logger.err(`error refreshing and setting Cherwell token: ${err2}`);
							reject(err2);
						}
					} else {
						await CherwellTokenCache.setToken(body);
						resolve(body);
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
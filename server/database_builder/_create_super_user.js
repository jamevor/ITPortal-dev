const User = require('../../models/User.js');
const logger = require('../logger.js');
const defaultValues = require('./databaseDefaultValues.js');
module.exports = () => {
	User.findOne(
		{
			where: {
				username: defaultValues.adminUser.username
			}
		}
	).then(user => {
		if (!user) {
			const newUser = User.build({
				username: defaultValues.adminUser.username,
				isSuperUser: true,
				isAdmin: true,
				givenname: 'admin',
				surname: 'admin',
				jobTitle: 'admin'
			});
			newUser.hashPassword(defaultValues.adminUser.password).then(res => {
				if (res) {
					newUser.password = res;
					newUser.save().then((newUser_) => {
						logger.notify(`successfully created default admin user at ${newUser_.createdAt} with guid ${newUser_.guid}`);
					}).catch(err => {
						logger.err('failed to save default admin user');
						logger.err(err);
					});
				} else {
					logger.err('failed to create default admin user');
				}
			}).catch(err => {
				logger.err('failed to create default admin user');
				logger.err(err);
			});
		} else {
			logger.notify(`default admin user already exists - created ${user.createdAt}`);
		}
	}).catch(err => {
		logger.err(err);
	});
};
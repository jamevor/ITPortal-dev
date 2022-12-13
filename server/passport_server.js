const PassportSaml = require('passport-saml');
const PassportLocal = require('passport-local');
const User = require('../models/User.js');
const UserPreference = require('../models/UserPreference.js');
const UserSiteTour = require('../models/UserSiteTour.js');
const logger = require('./logger.js');
const PassportSamlMetadata = require('passport-saml-metadata');
const G = require('./_global_logic.js');

const metaDataURL = process.env.SAML_URL;
const callbackURL = process.env.SAML_CALLBACK_URL;
const issuer = process.env.SAML_ISSUER;

var samlStrategy, localStrategy;

module.exports = {
	init: passport => {
		passport.serializeUser((user, done) => {
			done(null, user.id);
			return null;
		});

		passport.deserializeUser((id, done) => {
			User.findById(id).then(user => {
				user = user.toJSON();

				// UserPermissionLevels
				user.permissions = {};
				for (let p of user.userPermissionLevels) {
					user.permissions[p.permission.title] = {
						idPermission: p.permission.id,
						level: p.permissionLevel ? p.permissionLevel.id : null,
						title: p.permissionLevel ? p.permissionLevel.title : null
					};
				}
				delete user.userPermissionLevels;

				// Groups and GroupPermissionLevels
				const userGroups = [];
				for (let g of user.groups) {
					const groupPermissions = {};
					for (let p of g.groupPermissionLevels) {
						groupPermissions[p.permission.title] = {
							idPermission: p.permission.id,
							level: p.permissionLevel ? p.permissionLevel.id : null,
							title: p.permissionLevel ? p.permissionLevel.title : null,
						};
					}
					userGroups.push(
						{
							id: g.id,
							title: g.title,
							isSuper: g.isSuper,
							permissions: groupPermissions
						}
					);
				}
				user.groups = userGroups;

				done(null, user);
				return null;
			}).catch(err => {
				done(err, null);
				return null;
			});
		});

		// active

		PassportSamlMetadata.fetch({url: metaDataURL}).then(reader => {
			const samlConfig = PassportSamlMetadata.toPassportConfig(reader);
			samlConfig.callbackUrl = callbackURL;
			samlConfig.issuer = issuer;
			samlConfig.passReqToCallback = true;
			samlConfig.disableRequestedAuthnContext = true;
			// samlConfig.passive= true, //Passive test
			samlStrategy = new PassportSaml.Strategy(samlConfig, (req, profile, done) => {
				const profile_ = {};
				for (let key in profile) {
					if (key.includes('/')) {
						profile_[key.split('/')[key.split('/').length - 1]] = profile[key];
					} else {
						profile_[key] = profile[key];
					}
				}
				User.findOrCreate({
					where: {
						oid: profile_.objectidentifier
					}
				}).then(async([user]) => {
					req.session.userAttributes = profile_;
					req.session.save(err => {
						if (err) {
							done(err);
							return null;
						}
					});
					user.username = profile_.nameID;
					user.hue = user.hue || G.stringToHue(user.username);
					user.givenname = profile_.givenname;
					user.surname = profile_.surname;
					user.companyName = profile_['user.companyname'];
					user.department = profile_['user.department'];
					user.jobTitle = profile_['user.jobtitle'];
					user.employeeID = profile_['user.employeeid'];
					user.employeeNumber = profile_['user.employeeNumber'];
					await user.save();
					UserPreference.findOrCreate({
						where: {
							idUser: user.id
						}
					}).then(() => {
						UserSiteTour.findOrCreate({
							where: {
								idUser: user.id
							}
						}).then(() => {
							done(null, user);
							return null;
						}).catch(err => {
							done(err);
							return null;
						});
					}).catch(err => {
						done(err);
						return null;
					});
				}).catch(err => {
					logger.err('error authenticating with SAML 2 passport strategy');
					logger.err(err);
					return done(err);
				});
			});
			passport.use('saml',samlStrategy);
			module.exports.samlStrategy = samlStrategy;
		}).catch(err => {
			logger.err(err);
			return err;
		});

		localStrategy = new PassportLocal.Strategy((username, password, done) => {
			User.findOne(
				{
					where: {
						username: username
					}
				}
			).then(user => {
				if (user && user.verifyPassword(password)) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			}).catch(err => {
				return done(err);
			});
		});

		passport.use(localStrategy);
		module.exports.localStrategy = localStrategy;
	}
};

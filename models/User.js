'use strict';
const bcrypt = require('bcryptjs');
const logger = require('../server/logger.js');

module.exports = class User extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			oid: {
				type: DataTypes.STRING
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			guidPublic: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			username: DataTypes.STRING(128),
			password: DataTypes.STRING(60),
			isSuperUser: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			hue: DataTypes.INTEGER,
			givenname: DataTypes.STRING,
			surname: DataTypes.STRING,
			companyName: DataTypes.STRING,
			department: DataTypes.STRING,
			jobTitle: DataTypes.STRING,
			employeeID: DataTypes.STRING,
			employeeNumber: DataTypes.STRING
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'user',
			tableName: 'user',
			indexes: [
				{
					unique: true,
					fields: ['oid'],
					where: {
						oid: {
							[DataTypes.Op.ne]: null
						}
					}
				},
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.hasOne(models.UserPreference, { foreignKey: 'idUser' });
		this.hasOne(models.UserSiteTour, { foreignKey: 'idUser' });
		this.hasMany(models.UserOauth, { foreignKey: 'idUser' });
		this.hasMany(models.UserPermissionLevel, { foreignKey: 'idUser' });
		this.belongsToMany(models.Group, { through: models.GroupHasUser, foreignKey: 'idUser' });
		this.belongsToMany(models.MyApp, { through: models.UserHasMyApp, foreignKey: 'idUser' });
		this.belongsToMany(models.Widget, { through: models.UserHasWidget, foreignKey: 'idUser' });
	}

	static findById(id) {
		const UserPreference = require('./UserPreference.js');
		const UserSiteTour = require('./UserSiteTour.js');
		const UserOauth = require('./UserOauth.js');
		const Widget = require('./Widget.js');
		const UserPermissionLevel = require('./UserPermissionLevel.js');
		const Permission = require('./Permission.js');
		const PermissionLevel = require('./PermissionLevel.js');
		const Group = require('./Group.js');
		const GroupPermissionLevel = require('./GroupPermissionLevel.js');

		const User_Attributes = ['id', 'oid', 'guid', 'guidPublic', 'isSuperUser', 'isAdmin', 'createdAt', 'hue', 'employeeID'];
		const UserPermissionLevel_Attributes = ['idUser', 'idPermission', 'idPermissionLevel'];
		const Group_Attributes = ['id', 'title', 'isSuper'];
		const GroupPermissionLevel_Attributes = ['idGroup', 'idPermission', 'idPermissionLevel'];
		const Permission_Attributes = ['id', 'title'];
		const PermissionLevel_Attributes = ['id', 'title'];
		const UserOauth_Attributes = ['idUser', 'guid', 'type', 'isBroken'];
		return User.findByPk(id,
			{
				attributes: User_Attributes,
				include: [
					{
						model: UserPreference
					},
					{
						model: UserSiteTour
					},
					{
						model: UserOauth,
						attributes: UserOauth_Attributes,
					},
					{
						model: Widget
					},
					{
						model: UserPermissionLevel,
						attributes: UserPermissionLevel_Attributes,
						include: [
							{
								model: Permission,
								attributes: Permission_Attributes
							},
							{
								model: PermissionLevel,
								attributes: PermissionLevel_Attributes
							}
						]
					},
					{
						model: Group,
						attributes: Group_Attributes,
						include: [
							{
								model: GroupPermissionLevel,
								attributes: GroupPermissionLevel_Attributes,
								include: [
									{
										model: Permission,
										attributes: Permission_Attributes
									},
									{
										model: PermissionLevel,
										attributes: PermissionLevel_Attributes
									}
								]
							}
						]
					}
				]
			}
		);
	}

	/**
   * @author Ryan LaMarche
   * @description generates a salt and hashes {password} with that salt,
   *  then stores the hash in the database for a local user account.
   * @param {String} password plain text password.
   * @return {Promise} resolves with {true} when complete.
   */
	hashPassword(password) {
		return new Promise((resolve, reject) => {
			const saltRounds = 10;
			bcrypt.genSalt(saltRounds).then(salt => {
				bcrypt.hash(password, salt).then(hash => {
					return resolve(hash);
				}).catch(err => {
					logger.err(err);
					return reject(err);
				});
			}).catch(err => {
				logger.err(err);
				return reject(err);
			});
		});
	}

	/**
   * @author Ryan LaMarche
   * @description compares {password} the hashed password in the database for a local user account.
   * @param {String} password plain text password.
   * @return {Promise} resolves with {boolean} indicating whether or not the password matches.
   */
	verifyPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, this.password).then(res => {
				return resolve(res);
			}).catch(err => {
				logger.err(err);
				return reject(err);
			});
		});
	}

	static createLocalUser(username, password, givenname, surname, jobTitle) {
		User.findOne(
			{
				where: {
					username
				}
			}
		).then(user => {
			if (!user) {
				const newUser = User.build({
					username,
					isSuperUser: false,
					isAdmin: false,
					givenname,
					surname,
					jobTitle
				});
				newUser.hashPassword(password).then(res => {
					if (res) {
						newUser.password = res;
						newUser.save().then((newUser_) => {
							logger.notify(`successfully created new local user at ${newUser_.createdAt} with guid ${newUser_.guid}`);
						}).catch(err => {
							logger.err('failed to save new local user');
							logger.err(err);
						});
					} else {
						logger.err('failed to create new local user');
					}
				}).catch(err => {
					logger.err('failed to create new local user');
					logger.err(err);
				});
			} else {
				logger.notify(`new local user - already exists - created ${user.createdAt}`);
			}
		}).catch(err => {
			logger.err(err);
		});
	}



};
'use strict';
module.exports = class UserEditHistory extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			idUser: DataTypes.INTEGER,  // user id :)
			entityID: DataTypes.INTEGER, // id of article / news item ...
			entity: {
				type: DataTypes.STRING, // 'article', 'news', '...',
				values: ['article', 'spread', 'news', 'software', 'location', 'building', 'portfolio', 'service', 'component', 'server']
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'userEditHistory',
			tableName: 'userEditHistory',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
	}

	/**
	 * @author Ryan LaMarche
	 * @description Record a view / page visit for a user.
	 * @param {Number} idUser the user's id.
	 * @param {String} entity the entity to record for `['article', 'news', ...]`.
	 * @param {Number} entityID the id of the entity.
	 * @return {Promise} that will resolve with the userEditHistory object.
	 */
	static recordView(idUser, entity, entityID) {
		return new Promise((resolve, reject) => {
			UserEditHistory.findOrCreate(
				{
					where: {
						idUser,
						entity,
						entityID
					}
				}
			).then(async([userEditHistory, created]) => {
				if (!created) {
					await userEditHistory.save();
				}
				resolve(userEditHistory);
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	/**
	 * @author Ryan LaMarche
	 * @description get user's history by `user.id`.
	 * @param {Number} id `user.id`.
	 * @return {Promise<ArrayLike<UserEditHistory>>} a promise that will resolve with user's recent edit history.
	 */
	static findByUserId(id) {
		return new Promise((globalResolve, globalReject) => {
			UserEditHistory.findAll(
				{
					where: {
						idUser: id
					},
					order: [
						['updatedAt', 'DESC'] // most recent first
					],
					limit: 10
				}
			).then(userViewHistories => {
				globalResolve(userViewHistories);
				return null;
			}).catch(err => {
				globalReject(err);
				return null;
			});
		});
	}

};
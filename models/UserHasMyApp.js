'use strict';

module.exports = class UserHasMyApp extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idMyApp: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			isFavorite: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'userHasMyApp',
			tableName: 'userHasMyApp',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.User, {foreignKey: 'idUser'});
		this.belongsTo(models.MyApp, {foreignKey: 'idMyApp'});
	}

};
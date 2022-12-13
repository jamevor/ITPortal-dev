'use strict';
module.exports = class NewsHasMyApp extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idNews: {
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
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'newsHasMyApp',
			tableName: 'newsHasMyApp',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
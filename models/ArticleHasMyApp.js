'use strict';
module.exports = class ArticleHasMyApp extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idArticle: {
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
			modelName: 'articleHasMyApp',
			tableName: 'articleHasMyApp',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
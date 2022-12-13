'use strict';
module.exports = class NewsHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idNews: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idArticle: {
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
			modelName: 'newsHasArticle',
			tableName: 'newsHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
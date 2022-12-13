'use strict';
module.exports = class ArticleHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idArticle: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAction: {
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
			modelName: 'articleHasAction',
			tableName: 'articleHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
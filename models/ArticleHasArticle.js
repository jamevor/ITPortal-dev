'use strict';
module.exports = class ArticleHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idArticleParent: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idArticleSibling: {
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
			modelName: 'articleHasArticle',
			tableName: 'articleHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class ArticleHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idArticle: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idTag: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'articleHasTag',
			tableName: 'articleHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
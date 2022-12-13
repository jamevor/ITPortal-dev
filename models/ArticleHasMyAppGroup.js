'use strict';
module.exports = class ArticleHasMyAppGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idArticle: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idMyAppGroup: {
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
			modelName: 'articleHasMyAppGroup',
			tableName: 'articleHasMyAppGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
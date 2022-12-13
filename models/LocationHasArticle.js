'use strict';
module.exports = class LocationHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idLocation: {
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
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'locationHasArticle',
			tableName: 'locationHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
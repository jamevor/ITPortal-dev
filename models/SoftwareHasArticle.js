'use strict';
module.exports = class SoftwareHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
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
			modelName: 'softwareHasArticle',
			tableName: 'softwareHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class ServiceHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
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
			modelName: 'serviceHasArticle',
			tableName: 'serviceHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
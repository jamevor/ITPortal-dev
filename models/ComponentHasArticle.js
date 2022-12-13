'use strict';
module.exports = class ComponentHasArticle extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
			},
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasArticle',
			tableName: 'componentHasArticle',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
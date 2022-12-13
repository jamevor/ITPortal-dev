'use strict';
module.exports = class NewsHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idNews: {
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
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'newsHasAction',
			tableName: 'newsHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
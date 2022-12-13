'use strict';
module.exports = class NewsSubHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idNewsSub: {
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
			modelName: 'newsSubHasAction',
			tableName: 'newsSubHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
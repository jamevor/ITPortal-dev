'use strict';
module.exports = class MyAppHasMyAppGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idMyApp: {
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
			modelName: 'myAppHasMyAppGroup',
			tableName: 'myAppHasMyAppGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
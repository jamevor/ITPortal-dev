'use strict';
module.exports = class LocationHasPackage extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idLocation: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idPackage: {
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
			modelName: 'locationHasPackage',
			tableName: 'locationHasPackage',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
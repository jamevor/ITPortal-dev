'use strict';
module.exports = class LocationHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idLocation: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idGroup: {
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
			modelName: 'locationHasGroup',
			tableName: 'locationHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
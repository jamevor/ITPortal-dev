'use strict';
module.exports = class BuildingHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idBuilding: {
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
			modelName: 'buildingHasGroup',
			tableName: 'buildingHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
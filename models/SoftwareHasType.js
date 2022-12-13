'use strict';
module.exports = class SoftwareHasType extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idSoftwareType: {
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
			modelName: 'softwareHasType',
			tableName: 'softwareHasType',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
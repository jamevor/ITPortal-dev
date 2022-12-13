'use strict';
module.exports = class SoftwareHasLocation extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idLocation: {
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
			modelName: 'softwareHasLocation',
			tableName: 'softwareHasLocation',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
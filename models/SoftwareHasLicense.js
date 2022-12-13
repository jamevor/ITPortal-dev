'use strict';
module.exports = class SoftwareHasLicense extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idLicense: {
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
			modelName: 'softwareHasLicense',
			tableName: 'softwareHasLicense',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
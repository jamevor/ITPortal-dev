'use strict';
module.exports = class PackageHasSoftware extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPackage: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idSoftware: {
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
			modelName: 'packageHasSoftware',
			tableName: 'packageHasSoftware',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
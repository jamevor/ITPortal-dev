'use strict';
module.exports = class PackageHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPackage: {
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
			modelName: 'packageHasGroup',
			tableName: 'packageHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
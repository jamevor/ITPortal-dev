'use strict';
module.exports = class SoftwareHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAlias: {
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
			modelName: 'softwareHasAlias',
			tableName: 'softwareHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
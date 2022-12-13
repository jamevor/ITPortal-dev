'use strict';
module.exports = class SoftwareHasServer extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idServer: {
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
			modelName: 'softwareHasServer',
			tableName: 'softwareHasServer',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
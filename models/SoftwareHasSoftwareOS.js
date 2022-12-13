'use strict';
module.exports = class SoftwareHasSoftwareOS extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idSoftwareOS: {
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
			modelName: 'softwareHasSoftwareOS',
			tableName: 'softwareHasSoftwareOS',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class SoftwareHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idTag: {
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
			modelName: 'softwareHasTag',
			tableName: 'softwareHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
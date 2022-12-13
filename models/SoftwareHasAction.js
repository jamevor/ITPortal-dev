'use strict';
module.exports = class SoftwareHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAction: {
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
			modelName: 'softwareHasAction',
			tableName: 'softwareHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
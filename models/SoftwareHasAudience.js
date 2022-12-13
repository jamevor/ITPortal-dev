'use strict';
module.exports = class SoftwareHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAudience: {
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
			modelName: 'softwareHasAudience',
			tableName: 'softwareHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
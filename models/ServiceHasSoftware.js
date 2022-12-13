'use strict';
module.exports = class ServiceHasSoftware extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
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
			modelName: 'serviceHasSoftware',
			tableName: 'serviceHasSoftware',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
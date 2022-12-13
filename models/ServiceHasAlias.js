'use strict';
module.exports = class ServiceHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
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
			modelName: 'serviceHasAlias',
			tableName: 'serviceHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
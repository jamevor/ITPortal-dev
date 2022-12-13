'use strict';
module.exports = class ServerHasPackage extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idServer: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idPackage: {
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
			modelName: 'serverHasPackage',
			tableName: 'serverHasPackage',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
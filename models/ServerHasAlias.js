'use strict';
module.exports = class ServerHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idServer: {
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
			modelName: 'serverHasAlias',
			tableName: 'serverHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
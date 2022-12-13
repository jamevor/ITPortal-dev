'use strict';
module.exports = class ServerHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idServer: {
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
			modelName: 'serverHasTag',
			tableName: 'serverHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
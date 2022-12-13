'use strict';
module.exports = class ServerHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idServer: {
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
			modelName: 'serverHasAudience',
			tableName: 'serverHasAudience',
			idnexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
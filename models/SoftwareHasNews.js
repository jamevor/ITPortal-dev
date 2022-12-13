'use strict';
module.exports = class SoftwareHasNews extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSoftware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idNews: {
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
			modelName: 'softwareHasNews',
			tableName: 'softwareHasNews',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
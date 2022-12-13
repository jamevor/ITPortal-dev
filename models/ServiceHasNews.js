'use strict';
module.exports = class ServiceHasNews extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
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
			modelName: 'serviceHasNews',
			tableName: 'serviceHasNews',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
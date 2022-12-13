'use strict';
module.exports = class ServiceHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
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
			modelName: 'serviceHasTag',
			tableName: 'serviceHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
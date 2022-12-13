'use strict';
module.exports = class ServiceHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idService: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAction: {
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
			modelName: 'serviceHasAction',
			tableName: 'serviceHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
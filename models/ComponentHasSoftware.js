'use strict';
module.exports = class ComponentHasSoftware extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasSoftware',
			tableName: 'componentHasSoftware',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
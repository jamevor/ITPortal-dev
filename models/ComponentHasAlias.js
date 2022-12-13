'use strict';
module.exports = class ComponentHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasAlias',
			tableName: 'componentHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
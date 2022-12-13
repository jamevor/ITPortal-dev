'use strict';
module.exports = class ComponentHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: false
			},
			idAction: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'componentHasAction',
			tableName: 'componentHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
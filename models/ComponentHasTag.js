'use strict';
module.exports = class ComponentHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasTag',
			tableName: 'componentHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class ComponentHasNews extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasNews',
			tableName: 'componentHasNews',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
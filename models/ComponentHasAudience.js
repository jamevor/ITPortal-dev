'use strict';
module.exports = class ComponentHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idComponent: {
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
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'componentHasAudience',
			tableName: 'componentHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class SpreadHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSpread: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idGroup: {
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
			modelName: 'spreadHasGroup',
			tableName: 'spreadHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
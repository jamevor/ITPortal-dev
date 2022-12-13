'use strict';
module.exports = class SpreadHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSpread: {
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
			},
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'spreadHasAlias',
			tableName: 'spreadHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
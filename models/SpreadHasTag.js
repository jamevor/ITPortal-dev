'use strict';
module.exports = class SpreadHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSpread: {
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
			},
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'spreadHasTag',
			tableName: 'spreadHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
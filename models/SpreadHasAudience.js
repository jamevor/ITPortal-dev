'use strict';
module.exports = class SpreadHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSpread: {
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
			},
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'spreadHasAudience',
			tableName: 'spreadHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
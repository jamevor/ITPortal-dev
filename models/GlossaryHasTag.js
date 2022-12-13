'use strict';
module.exports = class GlossaryHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idGlossary: {
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
			modelName: 'glossaryHasTag',
			tableName: 'glossaryHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
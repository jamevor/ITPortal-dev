'use strict';
module.exports = class SubSiteHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSubSite: {
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
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'subSiteHasTag',
			tableName: 'subSiteHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class SubSiteHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSubSite: {
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
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'subSiteHasAudience',
			tableName: 'subSiteHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
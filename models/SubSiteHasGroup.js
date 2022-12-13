'use strict';
module.exports = class SubSiteHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idSubSite: {
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
			modelName: 'subSiteHasGroup',
			tableName: 'subSiteHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
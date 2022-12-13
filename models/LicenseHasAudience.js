'use strict';
module.exports = class LicenseHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idLicense: {
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
			modelName: 'licenseHasAudience',
			tableName: 'licenseHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
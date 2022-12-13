'use strict';
module.exports = class LicenseStatus extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500)
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'licenseStatus',
			tableName: 'licenseStatus',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
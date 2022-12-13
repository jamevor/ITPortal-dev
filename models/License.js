'use strict';
module.exports = class License extends require('sequelize').Model {
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
			idLicensePhase: DataTypes.INTEGER,
			idLicenseStatus: DataTypes.INTEGER,
			idLicenseUse: DataTypes.INTEGER,
			idLiceseAccessType: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			count: DataTypes.INTEGER,
			server: DataTypes.STRING(200),
			dateExpiration: DataTypes.DATE,
			dateActive: DataTypes.DATE,
			owner: DataTypes.STRING(200),
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'license',
			tableName: 'license',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.LicensePhase, {foreignKey: 'idLicensePhase'});
		this.belongsTo(models.LicenseStatus, {foreignKey: 'idLicenseStatus'});
		this.belongsTo(models.LicenseUse, {foreignKey: 'idLicenseUse'});
		this.belongsTo(models.LicenseAccessType, {foreignKey: 'idLiceseAccessType'});
		this.belongsToMany(models.Tag, {through: models.LicenseHasTag,foreignKey: 'idLicense'});
		this.belongsToMany(models.Audience, {through: models.LicenseHasAudience, foreignKey: 'idLicense'});
		this.belongsToMany(models.Software, {through: models.SoftwareHasLicense, foreignKey: 'idLicense'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}
};
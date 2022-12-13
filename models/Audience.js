'use strict';
module.exports = class Audience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
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
				descriptionShort: DataTypes.STRING(500),
				icon: DataTypes.STRING(30),
				color: DataTypes.STRING(6),
				createdBy: DataTypes.INTEGER,
				modifiedBy: DataTypes.INTEGER,
				isArchived: {
					type: DataTypes.BOOLEAN,
					defaultValue: false
				},
				idMetadataPhase: DataTypes.INTEGER
			},
			{
				sequelize,
				freezeTableName: false,
				timestamps: true,
				modelName: 'audience',
				tableName: 'audience',
				indexes: [
					{
						unique: true,
						fields: ['id', 'title']
					},
					{
						unique: true,
						fields: ['guid']
					}
				]
			}
		);
	}
	static associate(models) {
		this.belongsTo(models.MetadataPhase, {foreignKey: 'idMetadataPhase'});
		this.belongsToMany(models.Article, { through: models.ArticleHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Component, { through: models.ComponentHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.License, { through: models.LicenseHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Location, { through: models.LocationHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.News, { through: models.NewsHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Server, { through: models.ServerHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Service, { through: models.ServiceHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasAudience, foreignKey: 'idAudience' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Spread, { through: models.SpreadHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.SubSite, { through: models.SubSiteHasAudience, foreignKey: 'idAudience' });
		this.belongsToMany(models.Gizmo, { through: models.GizmoHasAudience, foreignKey: 'idAudience' });
	}

	isAccessRestricted() {
		return false;
	}

	getPhaseTitle() {
		return this.metadataPhase.title;
	}
};

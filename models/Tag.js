'use strict';
module.exports = class Tag extends require('sequelize').Model {
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
			descriptionShort: DataTypes.STRING(500),
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
			timestamps: true,
			freezeTableName: false,
			modelName: 'tag',
			tableName: 'tag',
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
		});
	}

	static associate(models) {
		this.belongsTo(models.MetadataPhase, {foreignKey: 'idMetadataPhase'});
		this.belongsToMany(models.Article, { through: models.ArticleHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Component, { through: models.ComponentHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Glossary, { through: models.GlossaryHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.License, { through: models.LicenseHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Location, { through: models.LocationHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.News, { through: models.NewsHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Portfolio, { through: models.PortfolioHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Server, { through: models.ServerHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Service, { through: models.ServiceHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasTag, foreignKey: 'idTag' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Spread, { through: models.SpreadHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.SubSite, { through: models.SubSiteHasTag, foreignKey: 'idTag' });
		this.belongsToMany(models.Gizmo, { through: models.GizmoHasTag, foreignKey: 'idTag' });
	}

	isAccessRestricted() {
		return false;
	}

	getPhaseTitle() {
		return this.metadataPhase.title;
	}

};
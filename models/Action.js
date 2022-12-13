'use strict';
module.exports = class Action extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			idActionType: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			link: DataTypes.STRING(500),
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
			freezeTableName: false,
			timestamps: true,
			modelName: 'action',
			tableName: 'action',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.MetadataPhase, {foreignKey: 'idMetadataPhase'});
		this.belongsTo(models.ActionType, { foreignKey: 'idActionType' });
		this.belongsToMany(models.Article, { through: models.ArticleHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.Component, { through: models.ComponentHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.News, { through: models.NewsHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.NewsSub, { through: models.NewsSubHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.Portfolio, { through: models.PortfolioHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.Service, { through: models.ServiceHasAction, foreignKey: 'idAction' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasAction, foreignKey: 'idAction' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}

	isAccessRestricted() {
		return false;
	}

	getPhaseTitle() {
		return this.metadataPhase.title;
	}
};
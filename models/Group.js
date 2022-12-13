'use strict';

module.exports = class Group extends require('sequelize').Model {
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
			isSuper: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'group',
			tableName: 'group',
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
		this.hasMany(models.GroupPermissionLevel, { foreignKey: 'idGroup' });
		this.belongsToMany(models.User, { through: models.GroupHasUser, foreignKey: 'idGroup' });
		this.belongsToMany(models.Article, { through: models.ArticleHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Spread, { through: models.SpreadHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.News, { through: models.NewsHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Location, { through: models.LocationHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Building, { through: models.BuildingHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Portfolio, { through: models.PortfolioHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Service, { through: models.ServiceHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Component, { through: models.ComponentHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Server, { through: models.ServerHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.Package, { through: models.PackageHasGroup, foreignKey: 'idGroup' });
		this.belongsToMany(models.SubSite, { through: models.SubSiteHasGroup, foreignKey: 'idGroup' });
	}

};
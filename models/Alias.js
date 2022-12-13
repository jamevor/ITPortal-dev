'use strict';
module.exports = class Alias extends require('sequelize').Model {
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
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			idMetadataPhase: DataTypes.INTEGER
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'alias',
			tableName: 'alias',
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
		this.belongsToMany(models.Component, { through: models.ComponentHasAlias, foreignKey: 'idAlias' });
		this.belongsToMany(models.Location, { through: models.LocationHasAlias, foreignKey: 'idAlias' });
		this.belongsToMany(models.Portfolio, { through: models.PortfolioHasAlias, foreignKey: 'idAlias' });
		this.belongsToMany(models.Server, { through: models.ServerHasAlias, foreignKey: 'idAlias' });
		this.belongsToMany(models.Service, { through: models.ServiceHasAlias, foreignKey: 'idAlias' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasAlias, foreignKey: 'idAlias' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Spread, { through: models.SpreadHasAlias, foreignKey: 'idAlias' });
	}

	isAccessRestricted() {
		return false;
	}

	getPhaseTitle() {
		return this.metadataPhase.title;
	}
};
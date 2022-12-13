'use strict';
module.exports = class MyAppGroup extends require('sequelize').Model {
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
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			link: DataTypes.STRING(500),
			descriptionShort: DataTypes.STRING(500),
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6),
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			idMyAppPhase: DataTypes.INTEGER,
			idMyAppStatus: DataTypes.INTEGER
		},
		{
			sequelize,
			freezeTableName: false,
			timestamps: true,
			modelName: 'myApps',
			tableName: 'myApps',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.MyAppPhase, {foreignKey: 'idMyAppPhase'});
		this.belongsTo(models.MyAppStatus, {foreignKey: 'idMyAppStatus'});
		this.belongsToMany(models.Article, { through: models.ArticleHasMyAppGroup, foreignKey: 'idMyAppGroup' });
		this.belongsToMany(models.News, { through: models.NewsHasMyAppGroup, foreignKey: 'idMyAppGroup' });
		this.belongsToMany(models.MyApp, { through: models.MyAppHasMyAppGroup, foreignKey: 'idMyAppGroup' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}
};
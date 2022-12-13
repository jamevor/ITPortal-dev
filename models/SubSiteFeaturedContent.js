'use strict';
module.exports = class SubSiteFeaturedContent extends require('sequelize').Model {
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
			idSubSite: DataTypes.INTEGER,
			idPosition: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			idFileUpload: DataTypes.INTEGER,
			link: DataTypes.STRING(200),
			color: DataTypes.STRING(6),
			isPublished: DataTypes.BOOLEAN,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			order: DataTypes.INTEGER
		},
		{
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'subSiteFeaturedContent',
			tableName: 'subSiteFeaturedContent',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				},
				{
					unique: true,
					fields: ['order']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.SubSiteFeaturedContentPosition, {foreignKey: 'idPosition'});
		this.belongsTo(models.FileUpload, {as: 'image', foreignKey: 'idFileUpload'});
		this.belongsTo(models.SubSite, {foreignKey: 'idSubSite'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}
};
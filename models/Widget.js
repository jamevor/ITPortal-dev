'use strict';
module.exports = class Widget extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			oauthType: {
				type: DataTypes.STRING,
				values: ['hub', 'azure', 'canvas']
			},
			scriptSrc: DataTypes.STRING,
			containerId: DataTypes.STRING,
			icon: DataTypes.STRING(60),
			link: DataTypes.STRING,
			linkTitle: DataTypes.STRING,
			target: {
				type: DataTypes.STRING,
				defaultValue: '_self'
			},
			styles: DataTypes.TEXT
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'widget',
			tableName: 'widget',
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
		this.belongsToMany(models.User, { through: models.UserHasWidget, foreignKey: 'idWidget' });
	}

};
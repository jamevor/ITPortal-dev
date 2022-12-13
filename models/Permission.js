'use strict';

module.exports = class Permission extends require('sequelize').Model {
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
			title: DataTypes.STRING
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'permission',
			tableName: 'permission',
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
		this.hasMany(models.UserPermissionLevel, { foreignKey: 'idPermission' });
		this.hasMany(models.GroupPermissionLevel, { foreignKey: 'idPermission' });
	}
};
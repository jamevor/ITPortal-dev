'use strict';

module.exports = class PermissionLevel extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			title: DataTypes.STRING,
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'permissionLevel',
			tableName: 'permissionLevel',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.hasMany(models.UserPermissionLevel, { foreignKey: 'idPermissionLevel' });
		this.hasMany(models.GroupPermissionLevel, { foreignKey: 'idPermissionLevel' });
	}
};
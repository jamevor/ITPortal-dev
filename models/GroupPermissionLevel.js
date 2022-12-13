'use strict';

module.exports = class GroupPermissionLevel extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idGroup: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idPermission: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idPermissionLevel: DataTypes.INTEGER,
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'groupPermissionLevel',
			tableName: 'groupPermissionLevel',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.Group, { foreignKey: 'idGroup' });
		this.belongsTo(models.Permission, { foreignKey: 'idPermission' });
		this.belongsTo(models.PermissionLevel, { foreignKey: 'idPermissionLevel' });
	}
};
'use strict';

module.exports = class UserPermissionLevel extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
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
			modelName: 'userPermissionLevel',
			tableName: 'userPermissionLevel',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
		this.belongsTo(models.Permission, { foreignKey: 'idPermission' });
		this.belongsTo(models.PermissionLevel, { foreignKey: 'idPermissionLevel' });
	}
};
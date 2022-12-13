'use strict';
module.exports = class AssetImage extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				guid: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4
				},
				CIType: {
					type: DataTypes.STRING,
					allowNull: false
				},
				assetType: DataTypes.STRING,
				manufacturer: DataTypes.STRING,
				model: DataTypes.STRING,
				icon: DataTypes.STRING(30),
				idImage: DataTypes.INTEGER,
				createdBy: DataTypes.INTEGER,
				modifiedBy: DataTypes.INTEGER,
				isArchived: {
					type: DataTypes.BOOLEAN,
					defaultValue: false
				}
			},
			{
				sequelize,
				freezeTableName: false,
				timestamps: true,
				modelName: 'assetImage',
				tableName: 'assetImage',
				indexes: [
					{
						unique: true,
						fields: ['id', 'CIType']
					},
					{
						unique: true,
						fields: ['guid']
					}
				]
			}
		);
	}
	static associate(models) {
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}
};

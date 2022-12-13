'use strict';
module.exports = class FileUpload extends require('sequelize').Model {
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
			guidPublic: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			path: DataTypes.STRING(200),
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500),
			altText: DataTypes.STRING(60),
			mimeType: DataTypes.STRING(20),
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
			modelName: 'fileUpload',
			tableName: 'fileUpload',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}

	getURL() {
		return `/file-upload/${this.guidPublic}/${this.title.toLowerCase().split('-')[this.title.toLowerCase().split('-').length - 1].replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}
};
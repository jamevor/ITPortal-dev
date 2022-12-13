'use strict';
module.exports = class GroupHasUser extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idGroup: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			isDefault: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'groupHasUser',
			tableName: 'groupHasUser',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
const moment = require('moment');
module.exports = class CopyToken extends require('sequelize').Model {
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
				entity: {
					type: DataTypes.STRING,
					allowNull: false
				},
				entityID: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				isValid: {
					type: DataTypes.BOOLEAN,
					defaultValue: true
				},
				expires: {
					type: DataTypes.DATE,
					defaultValue: function() {
						return moment(new Date()).add(3, 'days').format();
					}
				},
			}, {
				sequelize,
				timestamps: true,
				freezeTableName: false,
				modelName: 'copyToken',
				tableName: 'copyToken',
				indexes: [
					{
						unique: true,
						fields: ['entity', 'entityID']
					},
					{
						unique: true,
						fields: ['guid']
					}
				]
			}
		);
	}

};
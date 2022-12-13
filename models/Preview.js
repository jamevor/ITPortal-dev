'use strict';
const moment = require('moment');
module.exports = class Preview extends require('sequelize').Model {
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
				expires: {
					type: DataTypes.DATE,
					defaultValue: function() {
						return moment(new Date()).add(1, 'week').format();
					}
				},
				isArchived: {
					type: DataTypes.BOOLEAN,
					defaultValue: false
				}
			}, {
				sequelize,
				timestamps: true,
				freezeTableName: false,
				modelName: 'preview',
				tableName: 'preview',
				indexes: [
					{
						unique: false,
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

	getURL() {
		return `${process.env.SERVER_ROOT}/preview/${this.guid}`;
	}

};
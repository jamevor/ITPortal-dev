'use strict';
module.exports = class ActionType extends require('sequelize').Model {
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
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			target: {
				type: DataTypes.STRING(30),
				defaultValue: '_blank'
			},
			URIscheme: DataTypes.STRING(30),
			descriptionShort: DataTypes.STRING(500),
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6)
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'actionType',
			tableName: 'actionType',
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
};
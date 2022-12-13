'use strict';
module.exports = class DayOfWeek extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: {
				type: DataTypes.STRING(10),
				allowNull: false
			},
			titleShort: {
				type: DataTypes.STRING(3),
				allowNull: false
			},
			abbr: {
				type: DataTypes.STRING(2),
				allowNull: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			order: DataTypes.INTEGER // 1-7 indicate start of week
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'dayOfWeek',
			tableName: 'dayOfWeek',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
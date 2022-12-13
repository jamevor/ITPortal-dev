'use strict';
module.exports = class SpreadLayout extends require('sequelize').Model {
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
			svg: DataTypes.STRING(5000),
			column1Classlist: DataTypes.STRING(255), // cell small-12 medium-12 spread-column
			column2Classlist: DataTypes.STRING(255), // hide
			column3Classlist: DataTypes.STRING(255),
			column1IsShown: DataTypes.BOOLEAN,
			column2IsShown: DataTypes.BOOLEAN,
			column3IsShown: DataTypes.BOOLEAN
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'spreadLayout',
			tableName: 'spreadLayout',
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
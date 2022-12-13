'use strict';
module.exports = class SoftwarePhase extends require('sequelize').Model {
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
			descriptionShort: DataTypes.STRING(500),
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6)
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'softwarePhase',
			tableName: 'softwarePhase',
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
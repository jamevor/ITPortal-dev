'use strict';
module.exports = class SpecialHours extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			idLocation: DataTypes.INTEGER,
			reason: DataTypes.STRING,
			date: DataTypes.DATEONLY,
			timeOpen: DataTypes.TIME,
			timeClosed: DataTypes.TIME,
			isClosed: {
				type: DataTypes.BOOLEAN,
				default: false
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'specialHours',
			tableName: 'specialHours',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				},
				{
					unique: true,
					fields: ['idLocation', 'date']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.Location, {foreignKey: 'idLocation'});
	}
};
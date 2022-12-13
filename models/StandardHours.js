'use strict';
module.exports = class StandardHours extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			idLocation: DataTypes.INTEGER,
			idDayOfWeek: DataTypes.INTEGER,
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
			modelName: 'standardHours',
			tableName: 'standardHours',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				},
				{
					unique: true,
					fields: ['idLocation', 'idDayOfWeek']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.Location, {foreignKey: 'idLocation'});
		this.belongsTo(models.DayOfWeek, {foreignKey: 'idDayOfWeek'});
	}
};
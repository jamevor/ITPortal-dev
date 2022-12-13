'use strict';

module.exports = class UserSiteTour extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			isComplete: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isIgnored: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			progress: DataTypes.STRING(2000)
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'userSiteTour',
			tableName: 'userSiteTour',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
	}
};
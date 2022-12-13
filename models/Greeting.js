'use strict';
module.exports = class Greeting extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			languageTag: {
				type: DataTypes.STRING(2),
				allowNull: false,
				primaryKey: true,
				unique: true
			},
			greeting: {
				type: DataTypes.STRING(40),
				allowNull: false
			}
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'greeting',
			tableName: 'greeting',
			collate: 'utf8_general_ci'
		});
	}
};
'use strict';

module.exports = class UserHasWidget extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idWidget: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			isDashboard: DataTypes.BOOLEAN,
			isSidebar: DataTypes.BOOLEAN,
			orderDashboard: DataTypes.INTEGER,
			orderSidebar: DataTypes.INTEGER
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'userHasWidget',
			tableName: 'userHasWidget',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				},
				{
					unique: true,
					fields: ['idUser', 'orderDashboard']
				},
				{
					unique: true,
					fields: ['idUser', 'orderSidebar']
				}
			]
		});
	}

};
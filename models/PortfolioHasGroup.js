'use strict';
module.exports = class PortfolioHasGroup extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPortfolio: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idGroup: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'portfolioHasGroup',
			tableName: 'portfolioHasGroup',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
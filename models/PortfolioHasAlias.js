'use strict';
module.exports = class PortfolioHasAlias extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPortfolio: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAlias: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'portfolioHasAlias',
			tableName: 'portfolioHasAlias',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
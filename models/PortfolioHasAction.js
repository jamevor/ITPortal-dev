'use strict';
module.exports = class PortfolioHasAction extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPortfolio: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAction: {
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
			modelName: 'portfolioHasAction',
			tableName: 'portfolioHasAction',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
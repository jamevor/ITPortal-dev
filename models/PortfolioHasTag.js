'use strict';
module.exports = class PortfolioHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPortfolio: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idTag: {
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
			modelName: 'portfolioHasTag',
			tableName: 'portfolioHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
'use strict';
module.exports = class PortfolioHasService extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idPortfolio: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idService: {
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
			modelName: 'portfolioHasService',
			tableName: 'portfolioHasService',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
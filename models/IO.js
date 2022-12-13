'use strict';
const G = require('../server/_global_logic.js');
module.exports = class IO extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			isPublished: DataTypes.BOOLEAN,
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValue: G.defaultDateReviewByFunction
			},
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'io',
			tableName: 'io',
			indexes: [
				{
					unique: true,
					fields: ['id', 'title']
				},
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
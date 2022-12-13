'use strict';
module.exports = class ArticleContent extends require('sequelize').Model {
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
			idArticle: DataTypes.INTEGER,
			title: DataTypes.STRING(200),
			content: DataTypes.TEXT,
			order: DataTypes.INTEGER,
			timing: DataTypes.STRING(30),
			difficulty: DataTypes.INTEGER,
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'articleContent',
			tableName: 'articleContent',
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

	static associate(models) {
		this.belongsTo(models.Article, { foreignKey: 'idArticle' });
	}

};
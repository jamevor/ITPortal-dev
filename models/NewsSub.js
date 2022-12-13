'use strict';
module.exports = class NewsSub extends require('sequelize').Model {
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
			idNews: DataTypes.INTEGER,
			idNewsSubType: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500),
			datePost: DataTypes.DATE,
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: true,
			modelName: 'newsSub',
			tableName: 'newsSub',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.NewsSubType, {foreignKey: 'idNewsSubType'});
		this.belongsToMany(models.Action, {through: models.NewsSubHasAction, foreignKey: 'idNewsSub'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
	}
};
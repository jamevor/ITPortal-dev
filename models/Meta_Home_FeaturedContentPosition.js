'use strict';
module.exports = class Meta_Home_FeaturedContentPosition extends require('sequelize').Model {
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
				type: DataTypes.STRING(60),
				allowNull: false
			},
		},
		{
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'meta_home_featuredContentPosition',
			tableName: 'meta_home_featuredContentPosition',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
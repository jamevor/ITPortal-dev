'use strict';

module.exports = class UserPreference extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idUser: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			themePreference: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			navbarCompact: {
				type: DataTypes.BOOLEAN,
				default: false
			},
			navbarOpen: {
				type: DataTypes.BOOLEAN,
				default: false
			},
			textDisplay: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			seasonalTheme: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			hue: {
				type: DataTypes.INTEGER,
				defaultValue: null
			},
			meLabels: {
				type: DataTypes.BOOLEAN,
				default: false
			}
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'userPreference',
			tableName: 'userPreference',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'idUser' });
	}
};
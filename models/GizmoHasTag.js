'use strict';
module.exports = class GizmoHasTag extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idGizmo: {
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
			modelName: 'gizmoHasTag',
			tableName: 'gizmoHasTag',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
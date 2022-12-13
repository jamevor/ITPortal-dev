'use strict';
module.exports = class GizmoHasAudience extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			idGizmo: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			idAudience: {
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
			modelName: 'gizmoHasAudience',
			tableName: 'gizmoHasAudience',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
};
// 2.6.0
'use strict';

module.exports = {
	up: queryInterface => {
		return queryInterface.bulkUpdate('userPermissionLevel',
			{
				idPermissionLevel: 4,
				updatedAt: new Date()
			},
			{
				idPermissionLevel: 3
			}
		);
	},
	down: queryInterface => {
		return queryInterface.bulkUpdate('userPermissionLevel',
			{
				idPermissionLevel: 3,
				updatedAt: new Date()
			},
			{
				idPermissionLevel: 4
			}
		);
	}
};
// 2.6.0
'use strict';
const uuid = require('uuid/v4');

module.exports = {
	up: queryInterface => {
		return queryInterface.sequelize.transaction(t => {
			return Promise.all(
				[
					queryInterface.bulkUpdate('permissionLevel',
						{
							title: 'author',
							updatedAt: new Date()
						},
						{
							id: 3
						},
						{
							transaction: t
						}
					),
					queryInterface.bulkUpdate('permissionLevel',
						{
							title: 'publish',
							updatedAt: new Date()
						},
						{
							id: 4
						},
						{
							transaction: t
						}
					),
					queryInterface.bulkInsert('permissionLevel',
						[
							{
								id: 5,
								title: 'delete',
								guid: uuid(),
								createdAt: new Date(),
								updatedAt: new Date()
							},
						],
						{
							transaction: t
						}
					),
				]
			);
		});
	},
	down: queryInterface => {
		return queryInterface.sequelize.transaction(t => {
			return Promise.all(
				queryInterface.bulkUpdate('permissionLevel',
					{
						title: 'update',
						updatedAt: new Date()
					},
					{
						id: 3
					},
					{
						transaction: t
					}
				),
				queryInterface.bulkUpdate('permissionLevel',
					{
						title: 'delete',
						updatedAt: new Date()
					},
					{
						id: 4
					},
					{
						transaction: t
					}
				),
				[
					queryInterface.bulkDelete('permissionLevel',
						{
							id: 5
						}
					),
				]
			);
		});
	}
};
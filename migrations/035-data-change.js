// 3.0.0
'use strict';
const uuidv4 = require('uuid/v4');

module.exports = {
	up: async(queryInterface) => {
		await queryInterface.bulkInsert('group',
			[
				{
					id: 1,
					guid: uuidv4(),
					title: 'ESM-Admin-Publisher',
					isSuper: true,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 2,
					guid: uuidv4(),
					title: 'ITS-Knowledge-Publisher',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 3,
					guid: uuidv4(),
					title: 'ITS-Knowledge-Author',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 4,
					guid: uuidv4(),
					title: 'IGSD-Knowledge-Author',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 5,
					guid: uuidv4(),
					title: 'Workday-Knowledge-Publisher',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 6,
					guid: uuidv4(),
					title: 'Software-Publisher',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 7,
					guid: uuidv4(),
					title: 'Locations-Publisher',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 8,
					guid: uuidv4(),
					title: 'News-Publisher',
					isSuper: false,
					createdAt: new Date(),
					updatedAt: new Date()
				},
			]
		);

		await queryInterface.bulkInsert('groupHasUser',
			[
				{
					idGroup: 1,
					idUser: 7,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------
				{
					idGroup: 2,
					idUser: 9,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 2,
					idUser: 13,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 2,
					idUser: 56,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------
				{
					idGroup: 3,
					idUser: 47,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idUser: 53,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idUser: 6,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idUser: 4,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idUser: 5,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------------------
				{
					idGroup: 4,
					idUser: 912,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 4,
					idUser: 584,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 4,
					idUser: 2051,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------------------
				{
					idGroup: 5,
					idUser: 56,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 5,
					idUser: 286,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 5,
					idUser: 287,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------------------
				{
					idGroup: 6,
					idUser: 13,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------------------
				{
					idGroup: 7,
					idUser: 274,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ---------------------------
				{
					idGroup: 8,
					idUser: 56,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 8,
					idUser: 286,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 8,
					idUser: 9,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 8,
					idUser: 13,
					isDefault: 1,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
			]
		);
		await queryInterface.bulkInsert('groupPermissionLevel',
			[
				{
					idGroup: 1,
					idPermission: 1,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 2,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 3,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 4,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 5,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 6,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 7,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 8,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 9,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 10,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 11,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 13,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 17,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 18,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 19,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 20,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 21,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 22,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 24,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 26,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 1,
					idPermission: 27,
					idPermissionLevel: 5,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// --------------
				{
					idGroup: 2,
					idPermission: 1,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 2,
					idPermission: 4,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 2,
					idPermission: 5,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 2,
					idPermission: 26,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// -------------
				{
					idGroup: 3,
					idPermission: 1,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idPermission: 4,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idPermission: 5,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 3,
					idPermission: 26,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
				{
					idGroup: 4,
					idPermission: 1,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 4,
					idPermission: 4,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 4,
					idPermission: 5,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 4,
					idPermission: 26,
					idPermissionLevel: 3,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
				{
					idGroup: 5,
					idPermission: 1,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 5,
					idPermission: 4,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 5,
					idPermission: 5,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					idGroup: 5,
					idPermission: 26,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
				{
					idGroup: 6,
					idPermission: 3,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
				{
					idGroup: 7,
					idPermission: 7,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
				{
					idGroup: 8,
					idPermission: 8,
					idPermissionLevel: 4,
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				// ----------
			]
		);
	},
	down: () => {
	}
};
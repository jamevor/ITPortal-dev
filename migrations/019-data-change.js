// 2.4.0
const uuidv4 = require('uuid/v4');
module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('assetImage', [
			{
				guid: uuidv4(),
				CIType: 'Config - Computer',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-desktop',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Mobile Device',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-mobile-alt',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Network Device',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-router',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Not Inventoried',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-gift',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Other CI',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-puzzle-piece',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Printer',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-print',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Server',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-server',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Software License',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-key',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - System',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-sitemap',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				guid: uuidv4(),
				CIType: 'Config - Telephony Equipment',
				assetType: null,
				manufacturer: null,
				model: null,
				icon: 'fa-phone-office',
				idImage: null,
				createdBy: 1,
				modifiedBy: 1,
				isArchived: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		]);
	},
	down: () => {

	}
};
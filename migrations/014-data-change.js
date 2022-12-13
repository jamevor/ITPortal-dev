// 2.4.0
const uuidv4 = require('uuid/v4');
module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('serverPhase', [
			{
				id: 1,
				title: 'draft',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-file-edit',
				color: 'ff921f',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 2,
				title: 'review',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-clipboard-check',
				color: 'f3553d',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 3,
				title: 'publish',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-satellite-dish',
				color: '36d657',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 4,
				title: 'retire',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-archive',
				color: '9193fa',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},
	down: () => {
	}
};
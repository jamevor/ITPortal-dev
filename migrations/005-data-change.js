const uuidv4 = require('uuid/v4');
module.exports = {
	up: queryInterface => {
		return queryInterface.bulkInsert('permission', [
			{
				title: 'user',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'permission',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'hours',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'audience',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'alias',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'glossary',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'tag',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'action',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'package',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'license',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'app',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				title: 'appgroup',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},
	down: () => {
	}
};
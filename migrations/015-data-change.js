// 2.4.0
const uuidv4 = require('uuid/v4');
module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('permission', [
			{
				title: 'server',
				guid: uuidv4(),
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},
	down: () => {

	}
};
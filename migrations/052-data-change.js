'use strict';
const uuidv4 = require('uuid/v4');

module.exports = {
	up: queryInterface => {
		return queryInterface.bulkInsert('permission',
			[
				{
					title: 'subsite',
					guid: uuidv4(),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			]
		);
	}
};
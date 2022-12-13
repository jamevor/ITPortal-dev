// 2.6.0
'use strict';
module.exports = {
	up: queryInterface => {
		return queryInterface.bulkUpdate('permission',
			{
				title: 'myapp',
				updatedAt: new Date()
			},
			{
				title: 'app'
			}
		);
	}
};
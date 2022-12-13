// 2.6.0
'use strict';
module.exports = {
	up: queryInterface => {
		return Promise.all(
			[
				queryInterface.bulkUpdate('article',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('spread',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('news',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('software',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('location',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('building',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('portfolio',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('service',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('component',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('server',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				),
				queryInterface.bulkUpdate('package',
					{
						accessRestricted: false
					},
					{
						accessRestricted: null
					}
				)
			]
		);
	}
};
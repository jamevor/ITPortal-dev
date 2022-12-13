// 2.6.0
'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('group', 'isSuper', { type: Sequelize.BOOLEAN });
	},
	down: queryInterface => {
		return queryInterface.removeColumn('group', 'isSuper');
	}
};
// 2.6.0
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('groupHasUser', 'isDefault', { type: Sequelize.BOOLEAN });
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn('groupHasUser', 'isDefault');
	},
};

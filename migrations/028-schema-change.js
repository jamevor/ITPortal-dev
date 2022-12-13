// 2.6.0
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('article', 'accessRestricted', { type: Sequelize.BOOLEAN });
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn('article', 'accessRestricted');
	},
};
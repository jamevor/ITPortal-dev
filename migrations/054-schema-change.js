module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('subSite', 'isFeatured', { type: Sequelize.BOOLEAN });
	},
	down: () => {
	}
};

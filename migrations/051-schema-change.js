module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('subSite', 'isPublic', { type: Sequelize.BOOLEAN });
	},
	down: () => {
	}
};

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('location', 'hasZoomCapable', { type: Sequelize.BOOLEAN });
	},
	down: () => {
	}
};

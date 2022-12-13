module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('userPreference', 'meLabels', { type: Sequelize.BOOLEAN, defaultValue: false });
	},
	down: () => {
	}
};

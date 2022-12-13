module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('userPreference', 'hue', { type: Sequelize.INTEGER });
	},
	down: () => {
	}
};

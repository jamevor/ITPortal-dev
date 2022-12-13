module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('user', 'employeeNumber', { type: Sequelize.STRING });
	},
	down: () => {
	}
};

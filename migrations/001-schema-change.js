module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('myApps', 'idImage', Sequelize.INTEGER);
	},
	down: () => {
	}
};
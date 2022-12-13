module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('myApps', 'URIscheme', Sequelize.STRING(30));
	},
	down: () => {
	}
};
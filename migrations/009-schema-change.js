// 2.3.0
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('location', 'roomNotes', Sequelize.TEXT);
	},
	down: () => {

	},
};
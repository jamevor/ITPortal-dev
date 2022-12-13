// 2.3.1
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'userPreference',
			'seasonalTheme',
			{
				type: Sequelize.STRING,
			}
		);
	},
	down: () => {

	},
};
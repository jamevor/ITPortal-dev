// 2.3.1
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'userPreference',
			'textDisplay',
			{
				type: Sequelize.STRING,
			}
		);
	},
	down: () => {

	},
};
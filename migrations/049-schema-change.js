module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.addColumn('article', 'displayMode', { type: Sequelize.STRING(50) });
		await queryInterface.addColumn('article', 'requirements', { type: Sequelize.TEXT });
		await queryInterface.bulkUpdate('article',
			{
				displayMode: 'inline'
			},
			{
				displayMode: null
			}
		);
	},
	down: () => {
	}
};

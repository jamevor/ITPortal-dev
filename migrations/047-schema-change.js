module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.addColumn('myApps', 'isQuick', { type: Sequelize.BOOLEAN });
		await queryInterface.bulkUpdate('myApps',
			{
				isQuick: false,
				updatedAt: new Date()
			},
			{
				isQuick: null
			}
		);
	},
	down: () => {
	}
};

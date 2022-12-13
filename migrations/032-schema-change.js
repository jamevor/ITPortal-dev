module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			// create userEditHistory
			await queryInterface.createTable(
				'userEditHistory',
				{
					id: {
						type: Sequelize.INTEGER,
						primaryKey: true,
						autoIncrement: true
					},
					idUser: Sequelize.INTEGER,
					entityID: Sequelize.INTEGER,
					entity: Sequelize.STRING,
					guid: {
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4
					},
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('userEditHistory', {
				fields: ['id'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('userEditHistory', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	},
};
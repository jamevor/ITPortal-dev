// 3.0.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			await queryInterface.createTable('copyToken',
				{
					id: {
						type: Sequelize.INTEGER,
						primaryKey: true,
						autoIncrement: true
					},
					guid: Sequelize.UUID,
					entity: Sequelize.STRING,
					entityID: Sequelize.INTEGER,
					expires: Sequelize.DATE,
					isValid: Sequelize.BOOLEAN,
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('copyToken', {
				fields: ['id'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('copyToken', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('copyToken', {
				fields: ['entity', 'entityID'],
				type: 'UNIQUE',
				unique: true
			});
		} catch (err) {
			throw err;
		}
	},
	down: queryInterface => {
		return queryInterface.dropTable('copyToken');
	}
};

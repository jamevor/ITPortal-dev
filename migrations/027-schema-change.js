// 2.6.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			await queryInterface.createTable(
				'articleHasGroup',
				{
					idArticle: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					guid: {
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4
					},
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('articleHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('articleHasGroup', ['idArticle'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'article',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('articleHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	},
};
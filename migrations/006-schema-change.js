module.exports = {
	up: async(queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.addColumn(
				'article',
				'idImage',
				{
					type: Sequelize.INTEGER,
				},
				{ transaction }
			);
			await queryInterface.addConstraint('article', ['idImage'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'fileUpload',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
	down: () => {

	},
};
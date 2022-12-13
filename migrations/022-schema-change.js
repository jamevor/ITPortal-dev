// 2.5.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.removeColumn('location', 'image');
			await queryInterface.addColumn(
				'location',
				'idImage',
				{
					type: Sequelize.INTEGER,
				},
				{ transaction }
			);
			await queryInterface.addConstraint('location', ['idImage'], {
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
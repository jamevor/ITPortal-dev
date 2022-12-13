// 2.4.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			// create server phase
			await queryInterface.createTable(
				'serverPhase',
				{
					id: {
						type: Sequelize.INTEGER,
						primaryKey: true,
						autoIncrement: true
					},
					guid: {
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4
					},
					title: {
						type: Sequelize.STRING(200),
						allowNull: false
					},
					descriptionShort: Sequelize.STRING(500),
					icon: Sequelize.STRING(30),
					color: Sequelize.STRING(6),
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('serverPhase', {
				fields: ['id', 'title'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('serverPhase', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			// add column to server
			await queryInterface.addColumn('server', 'idServerPhase', Sequelize.INTEGER);
			// relate server to phase
			await queryInterface.addConstraint('server', ['idServerPhase'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'serverPhase',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	},
};
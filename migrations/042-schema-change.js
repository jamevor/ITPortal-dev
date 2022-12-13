// 3.1.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'userSiteTour',
			{
				idUser: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				guid: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4
				},
				isComplete: Sequelize.BOOLEAN,
				isIgnored: Sequelize.BOOLEAN,
				progress: Sequelize.STRING(2000),
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('userSiteTour', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('userSiteTour', ['idUser'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'user',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	}
};

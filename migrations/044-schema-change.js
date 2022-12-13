module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'userOauth',
			{
				idUser: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				guid: Sequelize.UUID,
				type: {
					type: Sequelize.STRING,
					primaryKey: true
				},
				code: Sequelize.STRING(5000),
				access_token: Sequelize.STRING(5000),
				refresh_token: Sequelize.STRING(5000),
				expires_at: Sequelize.DATE,
				isBroken: Sequelize.BOOLEAN,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('userOauth', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('userOauth', {
			fields: ['idUser', 'type'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('userOauth', ['idUser'], {
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

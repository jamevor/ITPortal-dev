module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'articleContent',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				guid: {
					type: Sequelize.UUID
				},
				idArticle: Sequelize.INTEGER,
				title: {
					type: Sequelize.STRING(200),
					allowNull: false
				},
				content: Sequelize.TEXT,
				order: Sequelize.INTEGER,
				timing: Sequelize.STRING(30),
				difficulty: Sequelize.INTEGER,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('articleContent', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('articleContent', {
			fields: ['id', 'title'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('articleContent', ['idArticle'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'article',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	}
};

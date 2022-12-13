// 3.1.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'newsHasArticle',
			{
				idNews: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				idArticle: {
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
		await queryInterface.addIndex('newsHasArticle', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('newsHasArticle', ['idNews'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'news',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('newsHasArticle', ['idArticle'], {
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

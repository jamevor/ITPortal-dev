// 3.1.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'articleHasArticle',
			{
				idArticleParent: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				idArticleSibling: {
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
		await queryInterface.addIndex('articleHasArticle', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('articleHasArticle', ['idArticleParent'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'article',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('articleHasArticle', ['idArticleSibling'], {
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

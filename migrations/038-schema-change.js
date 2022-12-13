// 3.0.0

module.exports = {
	up: async(queryInterface, Sequelize) => {
		// create join for tags
		await queryInterface.createTable(
			'locationHasArticle',
			{
				idLocation: {
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
		await queryInterface.addIndex('locationHasArticle', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('locationHasArticle', ['idLocation'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'location',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('locationHasArticle', ['idArticle'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'article',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	},
	down: () => {

	}
};

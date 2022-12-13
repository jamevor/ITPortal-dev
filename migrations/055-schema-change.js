const uuidv4 = require('uuid/v4');

module.exports = {
	up: async(queryInterface, Sequelize) => {
		/**
		 * subsite featured content
		 */
		await queryInterface.createTable(
			'subSiteFeaturedContent',
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
				idSubSite: Sequelize.INTEGER,
				idPosition: Sequelize.INTEGER,
				title: {
					type: Sequelize.STRING(200),
					allowNull: false
				},
				idFileUpload: Sequelize.INTEGER,
				link: Sequelize.STRING(200),
				color: Sequelize.STRING(6),
				isPublished: Sequelize.BOOLEAN,
				isArchived: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				createdBy: Sequelize.INTEGER,
				modifiedBy: Sequelize.INTEGER,
				order: Sequelize.INTEGER,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('subSiteFeaturedContent', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('subSiteFeaturedContent', {
			fields: ['order'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('subSiteFeaturedContent', ['idSubSite'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSite',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});


		/**
		 * Position
		 */
		await queryInterface.createTable(
			'subSiteFeaturedContentPosition',
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
					type: Sequelize.STRING(60),
					allowNull: false
				},
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('subSiteFeaturedContentPosition', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});

		await queryInterface.addConstraint('subSiteFeaturedContent', ['idPosition'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSiteFeaturedContentPosition',
				field: 'id'
			},
			name: 'fk_subSiteFeaturedContentPosition',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		await queryInterface.bulkInsert('subSiteFeaturedContentPosition',
			[
				{
					id: 1,
					guid: uuidv4(),
					title: 'center',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 2,
					guid: uuidv4(),
					title: 'top',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 3,
					guid: uuidv4(),
					title: 'bottom',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 4,
					guid: uuidv4(),
					title: 'left',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 5,
					guid: uuidv4(),
					title: 'right',
					createdAt: new Date(),
					updatedAt: new Date()
				},
			]
		);
	}
};

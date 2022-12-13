module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.createTable(
			'widget',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				title: {
					type: Sequelize.STRING(200),
					allowNull: false
				},
				guid: {
					type: Sequelize.UUID
				},
				oauthType: {
					type: Sequelize.STRING
				},
				scriptSrc: Sequelize.STRING,
				containerId: Sequelize.STRING,
				icon: Sequelize.STRING(60),
				link: Sequelize.STRING,
				linkTitle: Sequelize.STRING,
				target: {
					type: Sequelize.STRING
				},
				styles: Sequelize.TEXT,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('widget', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('widget', {
			fields: ['id', 'title'],
			type: 'UNIQUE',
			unique: true
		});


		await queryInterface.createTable(
			'userHasWidget',
			{
				idUser: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				idWidget: {
					type: Sequelize.INTEGER,
					primaryKey: true
				},
				guid: {
					type: Sequelize.UUID
				},
				isDashboard: Sequelize.BOOLEAN,
				isSidebar: Sequelize.BOOLEAN,
				orderDashboard: Sequelize.INTEGER,
				orderSidebar: Sequelize.INTEGER,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('userHasWidget', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('userHasWidget', {
			fields: ['idUser', 'orderSidebar'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('userHasWidget', {
			fields: ['idUser', 'orderDashboard'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('userHasWidget', ['idUser'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'user',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('userHasWidget', ['idWidget'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'widget',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	}
};

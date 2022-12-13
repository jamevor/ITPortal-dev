// 2.6.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			// spread
			await queryInterface.createTable(
				'spreadHasGroup',
				{
					idSpread: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('spreadHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('spreadHasGroup', ['idSpread'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spread',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('spreadHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// news
			await queryInterface.createTable(
				'newsHasGroup',
				{
					idNews: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('newsHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('newsHasGroup', ['idNews'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'news',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('newsHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// software
			await queryInterface.createTable(
				'softwareHasGroup',
				{
					idSoftware: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('softwareHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('softwareHasGroup', ['idSoftware'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'software',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('softwareHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// location
			await queryInterface.createTable(
				'locationHasGroup',
				{
					idLocation: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('locationHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('locationHasGroup', ['idLocation'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'location',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('locationHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// building
			await queryInterface.createTable(
				'buildingHasGroup',
				{
					idBuilding: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('buildingHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('buildingHasGroup', ['idBuilding'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'building',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('buildingHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// portfolio
			await queryInterface.createTable(
				'portfolioHasGroup',
				{
					idPortfolio: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('portfolioHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('portfolioHasGroup', ['idPortfolio'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'portfolio',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('portfolioHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// service
			await queryInterface.createTable(
				'serviceHasGroup',
				{
					idService: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('serviceHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('serviceHasGroup', ['idService'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'service',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('serviceHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// component
			await queryInterface.createTable(
				'componentHasGroup',
				{
					idComponent: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('componentHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('componentHasGroup', ['idComponent'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'component',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('componentHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// server
			await queryInterface.createTable(
				'serverHasGroup',
				{
					idServer: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('serverHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('serverHasGroup', ['idServer'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'server',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('serverHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});

			// package
			await queryInterface.createTable(
				'packageHasGroup',
				{
					idPackage: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idGroup: {
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
			await queryInterface.addIndex('packageHasGroup', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('packageHasGroup', ['idPackage'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'package',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('packageHasGroup', ['idGroup'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'group',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});



			// access restricted
			await queryInterface.addColumn('spread', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('news', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('software', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('location', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('building', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('portfolio', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('service', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('component', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('server', 'accessRestricted', { type: Sequelize.BOOLEAN });
			await queryInterface.addColumn('package', 'accessRestricted', { type: Sequelize.BOOLEAN });



		} catch (err) {
			throw err;
		}
	},
	down: () => {

	},
};
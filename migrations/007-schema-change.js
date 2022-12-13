module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			// create spread phase
			await queryInterface.createTable(
				'spreadPhase',
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
			await queryInterface.addIndex('spreadPhase', {
				fields: ['id', 'title'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('spreadPhase', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			// create spread layout
			await queryInterface.createTable(
				'spreadLayout',
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
					svg: Sequelize.STRING(5000),
					column1Classlist: Sequelize.STRING(255),
					column2Classlist: Sequelize.STRING(255),
					column3Classlist: Sequelize.STRING(255),
					column1IsShown: Sequelize.BOOLEAN,
					column2IsShown: Sequelize.BOOLEAN,
					column3IsShown: Sequelize.BOOLEAN,
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('spreadLayout', {
				fields: ['id', 'title'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('spreadLayout', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			// create spread table
			await queryInterface.createTable(
				'spread',
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
					idSpreadPhase: Sequelize.INTEGER,
					idSpreadLayout: Sequelize.INTEGER,
					idImage: Sequelize.INTEGER,
					column1IsBox: Sequelize.BOOLEAN,
					column2IsBox: Sequelize.BOOLEAN,
					column3IsBox: Sequelize.BOOLEAN,
					column1: Sequelize.TEXT,
					column2: Sequelize.TEXT,
					column3: Sequelize.TEXT,
					isArchived: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					dateReviewBy: Sequelize.DATE,
					createdBy: Sequelize.INTEGER,
					modifiedBy: Sequelize.INTEGER,
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			// add unique index to id, title on spread table
			await queryInterface.addIndex('spread', {
				fields: ['id', 'title'],
				type: 'UNIQUE',
				unique: true
			});
			// add unique index to guid on spread table
			await queryInterface.addIndex('spread', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			// relate spread to phase
			await queryInterface.addConstraint('spread', ['idSpreadPhase'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spreadPhase',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			// relate spread to layout
			await queryInterface.addConstraint('spread', ['idSpreadLayout'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spreadLayout',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			// relate spread to image
			await queryInterface.addConstraint('spread', ['idImage'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'fileUpload',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			// relate spread to created by user
			await queryInterface.addConstraint('spread', ['createdBy'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'user',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			// relate spread to modified by by user
			await queryInterface.addConstraint('spread', ['modifiedBy'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'user',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			// create join for tags
			await queryInterface.createTable(
				'spreadHasTag',
				{
					idSpread: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idTag: {
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
			await queryInterface.addIndex('spreadHasTag', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('spreadHasTag', ['idSpread'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spread',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('spreadHasTag', ['idTag'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'tag',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			// create join for audiences
			await queryInterface.createTable(
				'spreadHasAudience',
				{
					idSpread: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idAudience: {
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
			await queryInterface.addIndex('spreadHasAudience', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('spreadHasAudience', ['idSpread'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spread',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('spreadHasAudience', ['idAudience'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'audience',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			// create join for aliases
			await queryInterface.createTable(
				'spreadHasAlias',
				{
					idSpread: {
						type: Sequelize.INTEGER,
						primaryKey: true
					},
					idAlias: {
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
			await queryInterface.addIndex('spreadHasAlias', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('spreadHasAlias', ['idSpread'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'spread',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('spreadHasAlias', ['idAlias'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'alias',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	},
};
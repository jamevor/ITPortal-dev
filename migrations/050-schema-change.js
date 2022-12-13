const uuidv4 = require('uuid/v4');
module.exports = {
	up: async(queryInterface, Sequelize) => {
		/**
		 * subsite
		 */
		await queryInterface.createTable(
			'subSite',
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
				titleRoute: {
					type: Sequelize.STRING(200),
					allowNull: false
				},
				guid: Sequelize.UUID,
				idImage: Sequelize.INTEGER,
				icon: Sequelize.STRING(30),
				color: Sequelize.STRING(6),
				idSubSitePhase: Sequelize.INTEGER,
				dateReviewBy: Sequelize.DATE,
				createdBy: Sequelize.INTEGER,
				modifiedBy: Sequelize.INTEGER,
				isArchived: Sequelize.BOOLEAN,
				accessRestricted: Sequelize.BOOLEAN,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('subSite', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('subSite', {
			fields: ['id', 'title'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('subSite', ['createdBy'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'user',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('subSite', ['modifiedBy'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'user',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * phase
		 */
		await queryInterface.createTable(
			'subSitePhase',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				guid: Sequelize.UUID,
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
		await queryInterface.addConstraint('subSite', ['idSubSitePhase'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSitePhase',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		// add data for phases
		await queryInterface.bulkInsert('subSitePhase', [
			{
				id: 1,
				title: 'draft',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-file-edit',
				color: 'ff921f',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 2,
				title: 'review',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-clipboard-check',
				color: 'f3553d',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 3,
				title: 'publish',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-satellite-dish',
				color: '36d657',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 4,
				title: 'retire',
				guid: uuidv4(),
				descriptionShort: null,
				icon: 'fa-archive',
				color: '9193fa',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});

		/**
		 * group
		 */
		await queryInterface.createTable(
			'subSiteHasGroup',
			{
				idSubSite: {
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
		await queryInterface.addIndex('subSiteHasGroup', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('subSiteHasGroup', ['idSubSite'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSite',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('subSiteHasGroup', ['idGroup'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'group',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * Tag
		 */
		await queryInterface.createTable(
			'subSiteHasTag',
			{
				idSubSite: {
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
		await queryInterface.addIndex('subSiteHasTag', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('subSiteHasTag', ['idSubSite'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSite',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('subSiteHasTag', ['idTag'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'tag',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * Audience
		 */
		await queryInterface.createTable(
			'subSiteHasAudience',
			{
				idSubSite: {
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
		await queryInterface.addIndex('subSiteHasAudience', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('subSiteHasAudience', ['idSubSite'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSite',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('subSiteHasAudience', ['idAudience'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'audience',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * Gizmo
		 */
		await queryInterface.createTable(
			'gizmo',
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				guid: Sequelize.UUID,
				idSubSite: Sequelize.INTEGER,
				title: Sequelize.STRING(200),
				gizmoType: Sequelize.STRING,
				content: Sequelize.STRING(5000),
				widthPct: Sequelize.STRING(100),
				maxHeightPx: Sequelize.STRING(100),
				displayMode: Sequelize.STRING,
				limit: Sequelize.INTEGER, // 0 = dont limit
				orderResults: Sequelize.STRING,
				orderResultsIsAsc: Sequelize.BOOLEAN,
				isOr: Sequelize.BOOLEAN,
				orderPage: Sequelize.INTEGER,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE
			}
		);
		await queryInterface.addIndex('gizmo', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addIndex('gizmo', {
			fields: ['id', 'title'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('gizmo', ['idSubSite'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'subSite',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * Tag
		 */
		await queryInterface.createTable(
			'gizmoHasTag',
			{
				idGizmo: {
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
		await queryInterface.addIndex('gizmoHasTag', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('gizmoHasTag', ['idGizmo'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'gizmo',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('gizmoHasTag', ['idTag'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'tag',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		/**
		 * Audience
		 */
		await queryInterface.createTable(
			'gizmoHasAudience',
			{
				idGizmo: {
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
		await queryInterface.addIndex('gizmoHasAudience', {
			fields: ['guid'],
			type: 'UNIQUE',
			unique: true
		});
		await queryInterface.addConstraint('gizmoHasAudience', ['idGizmo'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'gizmo',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		await queryInterface.addConstraint('gizmoHasAudience', ['idAudience'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'audience',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

	}
};

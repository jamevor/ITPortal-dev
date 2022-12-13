// 2.4.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			// create server phase
			await queryInterface.createTable(
				'assetImage',
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
					CIType: {
						type: Sequelize.STRING,
						allowNull: false
					},
					assetType: Sequelize.STRING,
					manufacturer: Sequelize.STRING,
					model: Sequelize.STRING,
					icon: Sequelize.STRING(30),
					idImage: Sequelize.INTEGER,
					createdBy: Sequelize.INTEGER,
					modifiedBy: Sequelize.INTEGER,
					isArchived: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('assetImage', {
				fields: ['id', 'CIType'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('assetImage', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('assetImage', ['createdBy'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'user',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('assetImage', ['modifiedBy'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'user',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
			await queryInterface.addConstraint('assetImage', ['idImage'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'fileUpload',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
		} catch (err) {
			throw err;
		}
	},
	down: () => {

	}
};
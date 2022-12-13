// 2.3.1
module.exports = {
	up: async(queryInterface, Sequelize) => {
		try {
			await queryInterface.createTable(
				'twelveDaysOfITSCampaign',
				{
					id: {
						type: Sequelize.INTEGER,
						primaryKey: true,
						autoIncrement: true
					},
					idUser: Sequelize.INTEGER,
					hasViewedNews: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedMasterSpread: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread1: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread2: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread3: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread4: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread5: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread6: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread7: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread8: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread9: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread10: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread11: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					hasViewedSpread12: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					guid: {
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4
					},
					createdAt: Sequelize.DATE,
					updatedAt: Sequelize.DATE
				}
			);
			await queryInterface.addIndex('twelveDaysOfITSCampaign', {
				fields: ['guid'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addIndex('twelveDaysOfITSCampaign', {
				fields: ['idUser'],
				type: 'UNIQUE',
				unique: true
			});
			await queryInterface.addConstraint('twelveDaysOfITSCampaign', ['idUser'], {
				type: 'FOREIGN KEY',
				references: {
					table: 'user',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
		} catch(err) {
			throw err;
		}
	},
	down: () => {

	},
};
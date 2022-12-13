'use strict';
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.addColumn('software', 'researchLicense', Sequelize.BOOLEAN);
		await queryInterface.addColumn('software', 'availablePublicLabs', Sequelize.BOOLEAN);
		await queryInterface.addColumn('software', 'availableTerminalServer', Sequelize.BOOLEAN);
		await queryInterface.addColumn('software', 'availableVDI', Sequelize.BOOLEAN);
		await queryInterface.addColumn('software', 'availableSplashtop', Sequelize.BOOLEAN);
		await queryInterface.addColumn('software', 'usaOnly', Sequelize.BOOLEAN);
	}
};
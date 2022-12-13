// 2.5.0
'use strict';
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.addColumn('location', 'hasWacomTouchscreen', Sequelize.BOOLEAN);
		await queryInterface.addColumn('location', 'hasHDMILaptopCable', Sequelize.BOOLEAN);
		await queryInterface.addColumn('location', 'hasUSBCLaptopCable', Sequelize.BOOLEAN);
		await queryInterface.addColumn('location', 'hasBlurayPlayer', Sequelize.BOOLEAN);
	}
};
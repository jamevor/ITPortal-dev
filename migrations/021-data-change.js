// 2.5.0
module.exports = {
	up: async(queryInterface) => {
		await queryInterface.sequelize.query(
			'UPDATE `location` SET `location`.`hasWacomTouchscreen` = ?, `location`.`hasHDMILaptopCable` = ?, `location`.`hasUSBCLaptopCable` = ?, `location`.`hasBlurayPlayer` = ? WHERE ?',
			{
				replacements: ['0', '0', '0', '0', '1']
			}
		);
	}
};
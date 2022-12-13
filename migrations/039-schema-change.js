// 3.1.0
module.exports = {
	up: async(queryInterface, Sequelize) => {
		await queryInterface.addColumn('meta_home_featuredContent', 'order', { type: Sequelize.INTEGER });
		await queryInterface.addIndex('meta_home_featuredContent', {
			fields: ['order'],
			type: 'UNIQUE',
			unique: true
		});
	}
};
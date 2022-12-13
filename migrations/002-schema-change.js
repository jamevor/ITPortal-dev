module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('myApps', 'target', Sequelize.STRING(30)).then(() => {
			return queryInterface.addConstraint('myApps', ['idImage'], {
				type: 'foreign key',
				name: 'fk_myApps_fileUpload_1',
				references: {
					table: 'fileUpload',
					field: 'id'
				},
				onDelete: 'no action',
				onUpdate: 'cascade'
			});
		});
	},
	down: () => {
	}
};

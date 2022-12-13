module.exports = {
	up: queryInterface => {
		return queryInterface.addConstraint('subSite', ['idImage'], {
			type: 'FOREIGN KEY',
			references: {
				table: 'fileUpload',
				field: 'id'
			},
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	}
};

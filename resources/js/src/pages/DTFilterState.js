/* exported DTFilterState */
class DTFilterState {
	constructor(table, checkboxes, selects, searchCheckboxFilters) {
		this.table = table;
		checkboxes = checkboxes || [];
		this.checkboxFilters = {};
		for (const key of checkboxes) {
			this.checkboxFilters[key] = false;
			$(`#${key}`).on('change', () => {
				this.refresh();
			});
		}
		selects = selects || [];
		this.selectFilters = {};
		for (const key of selects) {
			this.selectFilters[key] = '';
			$(`#${key}`).on('change', () => {
				this.refresh();
			});
		}
		searchCheckboxFilters = searchCheckboxFilters || [];
		this.searchCheckboxFilters = {};
		for (const key of searchCheckboxFilters) {
			this.searchCheckboxFilters[key] = '';
			$(`#${key}`).on('change', () => {
				this.refresh();
			});
		}
		this.refresh();
	}

	draw() {
		for (const key in this.checkboxFilters) {
			this.table.columns(`${key}:name`).search(`${this.checkboxFilters[key] ? 'true' : ''}`);
		}
		for (const key in this.selectFilters) {
			this.table.columns(`${key}:name`).search(`${this.selectFilters[key]}`);
		}

		const regexes = {};
		const allColumnNames = [];
		for (const key in this.searchCheckboxFilters) {
			const columnName = $(`#${key}`).data('filtercolumn');
			if (!allColumnNames.includes(columnName)) {
				allColumnNames.push(columnName);
			}
			if (columnName in regexes) {
				if (this.searchCheckboxFilters[key].length) {
					regexes[columnName] += `|${this.searchCheckboxFilters[key]}`;
				}
			} else {
				if (this.searchCheckboxFilters[key].length) {
					regexes[columnName] = this.searchCheckboxFilters[key];
				}
			}
		}
		for (const columnName of allColumnNames) {
			if (columnName in regexes) {
				this.table.columns(`${columnName}:name`).search(regexes[columnName], true, false, true);
			} else {
				this.table.columns(`${columnName}:name`).search('');
			}
		}

		this.table.draw();
	}

	refresh() {
		for (const key in this.checkboxFilters) {
			this.checkboxFilters[key] = $(`#${key}`).is(':checked');
		}
		for (const key in this.selectFilters) {
			this.selectFilters[key] = $(`#${key}`).val() || '';
		}
		for (const key in this.searchCheckboxFilters) {
			this.searchCheckboxFilters[key] = $(`#${key}`).is(':checked') ? $(`#${key}`).val() : '';
		}
		this.draw();
	}

}
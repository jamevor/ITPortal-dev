/* global moment */
$(document).ready(function() {
	const container = '#widget-myCanvasToDos,#widget-myCanvasToDos--dashboard';

	$.ajax(
		{
			url: '/api/v1/canvas/getUserTasks',
			method: 'GET',
			success: function(data) {
				renderCanvasTodos(data);
			},
			error: function(resp) {
			}
		}
	);

	function getIconForTaskType(type) {
		const icons = {
			'submitting': 'fa-pencil',
			'grading': 'fa-file-check'
		};
		return icons[type] || 'fa-pencil';
	}

	function getVerbForTaskType(type) {
		const verbs = {
			'submitting': 'Turn In ',
			'grading': 'Grade '
		};
		return verbs[type] || '';
	}

	function renderCanvasTodos(data) {
		const { todos, courses } = data;
		let result = '<div class="canvas-todo-wrapper" data-simplebar>';
		for (const todo of todos) {
			const course = courses.find(course => course.id == todo.course_id);
			const due = todo.assignment.due_at ? moment(todo.assignment.due_at).local().format('MMM D') + ' at ' + moment(todo.assignment.due_at).local().format('h:mm a') : '';
			result += `<a class="todo-item" href="${todo.assignment.html_url}" target="_blank">
			<div class="todo-item-icon">
					<i class="fad ${getIconForTaskType(todo.type)}" style="color:${course.user_color}"></i>
			</div>
			<div class="todo-item-details">
				<div class="todo-item-task" style="color:${course.user_color}">
					${getVerbForTaskType(todo.type)}${todo.assignment.name}
				</div>
				<div class="todo-item-course">
					${course.name}
				</div>
				<div class="todo-item-value">
					<span class="todo-item-points">${todo.assignment.points_possible != null ? todo.assignment.points_possible + (todo.assignment.points_possible == 1 ? ' point' : ' points') : ''}</span>
					<span class="todo-item-due">${due}</span>
				</div>
			</div>
		</a>`;
		}
		result += '</div>';
		$(container).append(result);
	}

});
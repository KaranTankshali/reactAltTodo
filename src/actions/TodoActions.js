import dispatcher from '../dispatcher';

class TodoActions {
	constructor(){
		this.generateActions('clearCompleted');
		this.generateActions('clearAll');
		this.generateActions('markCompleted');
		
	}
	createTodo(task) {
		return task;
	}

	deleteTodo(task) {
		return task
	}

	editTodo(oldTask,newTask) {
		return({
			oldTask,
			newTask
		});
	}

	toggleTodo(task) {
		return task;
	}

	toggleSelected(task) {
		return task;
	}

	selectAll(val) {
		return val;
	}

}

export default dispatcher.createActions(TodoActions);



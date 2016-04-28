import dispatcher from '../dispatcher';

class TodoActions {
	constructor(){
		this.generateActions('clearCompleted');
		this.generateActions('clearAll');

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
}

export default dispatcher.createActions(TodoActions);



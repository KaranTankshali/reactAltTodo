import dispatcher from '../dispatcher';
import todoActions from '../actions/TodoActions';
import _ from 'lodash';

class StateStore{
	constructor() {
		
		this.state = [
		{
			task: 'make Todo App',
			isCompleted : true,
			isSelected: false
		},
		{
			task: 'Learn Alt.js',
			isCompletd : false,
			isSelected: true
		}
		];
		this.bindActions(todoActions);
	}

	onCreateTodo(task) {
		this.state.push({
			task,
			isCompleted: false,
			isSelected: false			
		});
		this.setState(this.state);
	}

	onDeleteTodo(task) {
		_.remove(this.state,(todo) => {
			return todo.task == task;
		});
		this.setState(this.state);
	}

	onEditTodo(taskSwap) {
		const tobeChanged = _.find(this.state , (todo) => {
			return todo.task == taskSwap.oldTask;
		});
		
		tobeChanged.task = taskSwap.newTask;
		this.setState(this.state);
	}

	onToggleTodo(task) {
		const tobeChanged = _.find(this.state , (todo) => {
			return todo.task === task;
		});
		tobeChanged.isCompleted = !tobeChanged.isCompleted;
		this.setState(this.state);
	}

	onClearCompleted() {
		_.remove(this.state,(todo) => {
			return todo.isCompleted == true;
		});
		this.setState(this.state);
	}

	onClearAll() {
		this.state = [];
		this.setState(this.state);
	}

	onToggleSelected(task) {
		const tobeChanged = _.find(this.state , (todo) => {
			return todo.task === task;
		});
		tobeChanged.isSelected = !tobeChanged.isSelected;
		this.setState(this.state);
	}

	onMarkCompleted() {
		_.forEach(this.state,(todo) => {
			if(todo.isSelected)
			{
				todo.isCompleted = true;
				todo.isSelected = false;
			}
		});
		this.setState(this.state);
	}

	onSelectAll(val) {
		_.forEach(this.state,(todo) => {
			todo.isSelected = val;
		});
		this.setState(this.state);
	}

}
export default dispatcher.createStore(StateStore, 'StateStore');
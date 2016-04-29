import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TodoStore from './src/stores/TodoStore';
import dispatcher from './src/dispatcher';
import SettingsStore from './src/stores/SettingsStore';
import todoActions from './src/actions/TodoActions';
import settingsActions from './src/actions/SettingsActions';

class TodoApp extends React.Component {
	
	constructor(){
		super();
		this.state = ({
			todos : TodoStore.getState()
		});
		this.getTodos = this.getTodos.bind(this);
	}
	componentWillMount() {
		TodoStore.listen(this.getTodos)
	}

	componentWillUnmount() {
		TodoStore.unListen(this.getTodos)
	}

	getTodos(){
		this.setState({
			todos: TodoStore.getState()
		})
	} 

	render(){
		return(
			<div className="todo">
				<h2>Todo</h2>
				<h3>Add New </h3>
				<CreateTodo  todos={this.state.todos} newTask={this.newTask}/>
				<h3>My Tasks</h3>
				<TodoList todos = {this.state.todos}/>
				<h5>Click on the task to toggle completed</h5>
			</div>
		);
	}	
}

class CreateTodo extends React.Component {
	constructor(){
		super();
		this.handleCreate = this.handleCreate.bind(this);
		this.state = {
			error : null
		}
	}
	handleCreate(event){
		event.preventDefault();
		const newInput = this.refs.nextTodo;
		const newTask = newInput.value;
		const validateInput = this.validateInput(newTask);
		if(!validateInput)
		{	
			todoActions.createTodo(this.refs.nextTodo.value);
			this.refs.nextTodo.value = '';
			this.setState({error:null});
		}
		else
		{
			this.setState({error:validateInput});
		}

	}
	renderError(){
		if(!this.state.error)
		{
			return null;
		}
		else
		{
			return <h4 style={{color:'red'}}>{this.state.error}</h4>
		}
	}
	render(){
		return(
			<form onSubmit={this.handleCreate}>
				<input typs="text" placeholder="What is next Todo?" ref="nextTodo"/>
				<button className="btn btn-success btn-sm" type="submit">Add</button>
				{this.renderError()}
			</form>
		);
	}
	validateInput(task)
	{
		if(!task)
		{
			return 'Please enter a non Empty Task.';
		}	
		else if(_.find(this.props.todos,function(todo){return todo.task===task}))
		{
			return 'Task already exist';
		}
		else
		{
			return null;
		}
	}
}
class TodoList extends React.Component {
	constructor(){
		super();
		this.state = ({
				show: SettingsStore.getState()
		});
		
		this.handleVisibility = this.handleVisibility.bind(this);
		this.clearCompleted = this.clearCompleted.bind(this);
		this.clearAll = this.clearAll.bind(this);
		this.getVisibility = this.getVisibility.bind(this);
		this.markCompleted = this.markCompleted.bind(this);
	}

	componentWillMount() {
		SettingsStore.listen(this.getVisibility);
	}

	componentWillUnmount() {
		SettingsStore.unListen(this.getVisibility);	
	}

	getVisibility() {
		this.setState({
				show: SettingsStore.getState()
		});
	}

	renderItems(){
		const props = _.omit(this.props,'todos');
		let listToShow = this.props.todos;
		if(this.state.show == 'SHOW_ACTIVE') {
			listToShow = _.filter(this.props.todos, (todo) => {
				return !todo.isCompleted;
			})
		}
		else if(this.state.show == 'SHOW_COMPLETED') {
			listToShow = _.filter(this.props.todos, (todo) => {
				return todo.isCompleted;
			});
		}

		return _.map(listToShow , function(todo,index){
			return (
				<TodoListItem key={index} {...todo} {...props}/>
			);
		})
	}
	render(){
		return(
			<div>
			<button className="btn btn-primary btn-sm" onClick={this.handleVisibility} data-tab="SHOW_ALL">Show All</button>
			<button className="btn btn-primary btn-sm" onClick={this.handleVisibility} data-tab="SHOW_COMPLETED">Show Completed</button>
			<button className="btn btn-primary btn-sm" onClick={this.handleVisibility} data-tab="SHOW_ACTIVE">Show Active</button>
			<button className="btn btn-warning btn-sm" onClick={this.clearCompleted}>Clear Completed</button>
			<button className="btn btn-danger btn-sm" onClick={this.clearAll}>Clear All</button>
			<button className="btn btn-info btn-sm" onClick={this.markCompleted}>Mark Completed Selected</button>
			<table className="table table-striped table-bordered table-hover table-condensed table-responsive">
				<TodoHeading/>
				<tbody>
						{this.renderItems()}
				</tbody>
			</table>
			
			</div>
		);
	}

	handleVisibility(event) {
		settingsActions.setVisibility(event.target.getAttribute('data-tab'));
	}

	clearCompleted() {
		todoActions.clearCompleted();
	}

	clearAll() {
		todoActions.clearAll();
	}

	markCompleted() {
		todoActions.markCompleted();
	}
}
class TodoHeading extends React.Component {
	constructor(){
		super();
		this.selectAll = this.selectAll.bind(this);
		this.renderInput = this.renderInput.bind(this);
		this.state = {
			selectAll : false
		};
	}
	renderInput(){
		if(this.state.selectAll) {
			return(
				<input className="select-all" type="checkbox" onChange={this.selectAll} checked/>
			);
		} else {
			return(
				<input className="select-all" type="checkbox" onChange={this.selectAll}/>
			);
		}
	}
	render(){
		return(
				<thead>
				<tr>
					<th><strong>Task</strong></th>
					<th><strong>Actions</strong></th>
					<th><strong>Select</strong>{this.renderInput()}</th>
				</tr>
				</thead>
		);
	}

	selectAll(){
		this.state.selectAll = !this.state.selectAll;
		todoActions.selectAll(this.state.selectAll);
		this.setState(this.state);
	}	
}
class TodoListItem extends React.Component {
	constructor(){
		super();
		this.state = {
			isEditing : false
		}
		this.onEditClick = this.onEditClick.bind(this);
		this.renderActionSection = this.renderActionSection.bind(this);
		this.renderTaskSection = this.renderTaskSection.bind(this);
		this.onCancelClick = this.onCancelClick.bind(this);
		this.onDeleteClick = this.onDeleteClick.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this);
		this.onToggle = this.onToggle.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}
	renderActionSection(){
		if(!this.state.isEditing)
		{
			return(
			<td>
				<button className="btn btn-info btn-sm" onClick={this.onEditClick}>Edit</button>
				<button className="btn btn-danger btn-sm" onClick={this.onDeleteClick}>Delete</button>
			</td>
			);
		}
		return(
			<td>
				<button className="btn btn-primary btn-sm" onClick={this.onSaveClick}>Save</button>
				<button className="btn btn-warning btn-sm" onClick={this.onCancelClick}>Cancel</button>
			</td>
			);
	}
	renderTaskSection(){
		const {task , isCompleted } = this.props;
		const taskStyle = {
			color : isCompleted ? '#aaaaaa' : 'black',
			cursor : 'pointer'
		};
		if(!this.state.isEditing)
		{
			return(
				<td style={taskStyle} onClick={this.onToggle}>
					{task}
				</td>
			);
		}
		return(
			<td>
			<form onSubmit={this.onSaveClick.bind(this)}>
				<input type="text" defaultValue={task} ref="editInput"/>
			</form>
			</td>
		);
	}

	renderCheckbox(){
		if(this.props.isSelected) {
			return ( 
				<td>
					<input type="checkbox" onChange={this.onInputChange} checked/>
				</td>
			);
		} else {
			return (
				<td>
					<input type="checkbox" onChange={this.onInputChange}/>
				</td>
			);
		}
	}
	render(){
		return(
			<tr>
				{this.renderTaskSection()}
				{this.renderActionSection()}
				{this.renderCheckbox()}	
			</tr>
		)
	}
	onEditClick(){
		this.setState({isEditing: true})
	}
	onCancelClick(){
		this.setState({isEditing: false})
	}
	onSaveClick(event){
		event.preventDefault();
		todoActions.editTodo(this.props.task , this.refs.editInput.value);
		this.setState({isEditing:false});
	}
	onDeleteClick(event){
		todoActions.deleteTodo(this.props.task);
		
	}
	onToggle(task) {
		todoActions.toggleTodo(this.props.task);
	}
	onInputChange() {
		todoActions.toggleSelected(this.props.task);
	}
} 
export default TodoApp;
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TodoStore from './src/stores/TodoStore';
import { createTodo } from './src/actions/TodoActions';

class TodoApp extends React.Component {
	
	constructor(){
		super();
		this.state = ({
			todos : TodoStore.getAll()
		});
		this.newTask = this.newTask.bind(this);
		this.toggleTask = this.toggleTask.bind(this);
		this.saveTask = this.saveTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
	}
	componentWillMount() {
		TodoStore.on('change', () => {
			this.setState({
				todos: TodoStore.getAll()
			})
		});
	}
	render(){
		return(
			<div>
				<h2>Todo</h2>
				<h3>Add New </h3>
				<CreateTodo  todos={this.state.todos} newTask={this.newTask}/>
				<h3>My Tasks</h3>
				<TodoList todos = {this.state.todos} toggleTask={this.toggleTask} saveTask={this.saveTask} deleteTask={this.deleteTask}/>
				<h5>Click on the task to mark it completed</h5>
			</div>
		);
	}
	newTask(task){
		this.state.todos.push({task,isCompleted:false});
		this.setState({todos:this.state.todos});
	}
	toggleTask(task){
		const toBeChanged = _.find(this.state.todos, function(todo){return todo.task === task });
		toBeChanged.isCompleted = !toBeChanged.isCompleted;
		this.setState({todos:this.state.todos});
	}
	saveTask(oldTask,newTask)
	{
		const toBeChanged = _.find(this.state.todos, function(todo){return todo.task === oldTask });
		toBeChanged.task = newTask;
		this.setState({todos:this.state.todos});
	}
	deleteTask(task){
		_.remove(this.state.todos,function(todo){return todo.task === task});
		this.setState({todos:this.state.todos});
	}
	setToShow(index){
		this.toBeShown = index;
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
			//this.props.newTask(this.refs.nextTodo.value);
			createTodo(this.refs.nextTodo.value);
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
				<button type="submit">Add</button>
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

	renderItems(){
		const props = _.omit(this.props,'todos')
		return _.map(this.props.todos , function(todo,index){
			return (
				<TodoListItem key={index} {...todo} {...props}/>
			);
		})
	}
	render(){
		return(
			<table>
				<TodoHeading/>
				<tbody>
						{this.renderItems()}
				</tbody>
			</table>
		);
	}
}
class TodoHeading extends React.Component {
	render(){
		return(
				<thead>
				<tr>
					<th><strong>Task</strong></th>
					<th><strong>Actions</strong></th>
				</tr>
				</thead>
		);
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
	}
	renderActionSection(){
		if(!this.state.isEditing)
		{
			return(
			<td>
				<button onClick={this.onEditClick}>Edit</button>
				<button onClick={this.onDeleteClick}>Delete</button>
			</td>
			);
		}
		return(
			<td>
				<button onClick={this.onSaveClick}>Save</button>
				<button onClick={this.onCancelClick}>Cancel</button>
			</td>
			);
	}
	renderTaskSection(){
		const {task , isCompleted} = this.props;
		const taskStyle = {
			color : isCompleted ? '#aaaaaa' : 'black',
			cursor : 'pointer'
		};
		if(!this.state.isEditing)
		{
			return(
				<td style={taskStyle} onClick={this.props.toggleTask.bind(this,task)}>
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
	render(){
		return(
			<tr>
				{this.renderTaskSection()}
				{this.renderActionSection()}	
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
		const oldTask = this.props.task;
		const newTask = this.refs.editInput.value;
		this.props.saveTask(oldTask,newTask);
		this.setState({isEditing:false});
	}
	onDeleteClick(event){
		const task = this.props.task;
		this.props.deleteTask(task);
	}
} 
export default TodoApp;
import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import settingsActions from '../actions/SettingsActions';
import _ from 'lodash';

class SettingsStore{
	constructor() {
		//super();
		this.state = "SHOW_ALL";
		//this.setVisibility = this.setVisibility.bind(this);
	//	this.getVisibility = this.getVisibility.bind(this);
	//	this.handleActions = this.handleActions.bind(this);

		this.bindActions(settingsActions);
	}

	onGetVisibility() {
		this.emitChange();
	}

	onSetVisibility(visibility) {
		this.state = visibility;
		this.setState(this.state);
		this.emitChange();
	}

	// handleActions(action) {
	// 	switch(action.type) {
	// 		case 'SET_VISIBILITY' :
	// 			this.setVisibility(action.visibility);
	// 			break;
	// 		default :
	// 			break;
	// 	}
	// 	//console.log("Todo Store received action", action);
	// }


}

export default dispatcher.createStore(SettingsStore, 'SettingsStore');
// const settingsStore = new SettingsStore();
// dispatcher.register(settingsStore.handleActions.bind(this));

// //window.dispatcher = dispatcher;
// export default settingsStore;

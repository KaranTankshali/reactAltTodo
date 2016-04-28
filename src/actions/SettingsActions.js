import dispatcher from '../dispatcher';

class SettingsActions {
	setVisibility(visibility) {
		return visibility;
	}
	getVisibility() {
		return;
	}
}

export default dispatcher.createActions(SettingsActions);
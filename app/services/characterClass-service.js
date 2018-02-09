Clark.factory('CharacterClass', ['$http', function($http) {
	function _then(callback, data, error) {
		//this is used to execute a function when the service method is finished in the event that the method is
		//running synchronous code meaning: running in the background while rest of app finishes loading
		//by asking for a callback you are able to execute code once you know that the method is finished
		if (angular.isFunction(callback))
			callback(data, error);
	}

	//all methods should ideally have two parameters, the first one being options you can pass it (how you want this method completed/which record you
	//want returned), second being callback which is executed when the method is finished doing what it needs to do
	var _list = function(options, callback) {
		$http.post('/app/assets/characterClass.json', {}, {}).then(function(response) {
			_then(callback, response.data);
		}).catch(function(response) {
			console.error(response);
			_then(callback, null, "Something's fucked up with the Character Class data file :( Malformed json or file not found");
		});

	}

//this return is how you're explaining what the 'Spell' service can do
//property names of this object are how you tell it what to do
	return {
		// _list is a reference to the _list function above
		//object with a property that is set to a function, that property is now a "method"
		// actual method name is list without underscore
		//underscore addded to prevent naming conflicts
		list: _list,
	}

}]);

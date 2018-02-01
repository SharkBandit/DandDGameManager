var Clark = angular.module('Clark', ['ngSanitize', 'ngMaterial','ngFileUpload']);

//does not work ERROR: Unknown provider: sanitizeFilterProvider <- sanitizeFilter
//but this totally does work in other Angular apps... ??
Clark.filter("sanitize", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);

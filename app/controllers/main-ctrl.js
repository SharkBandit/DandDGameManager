Clark.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.favoriteFood = 'Cheeseburger';

    $scope.changeFood = function(food) {
        if (typeof food == 'undefined' || !food.length) {
            food = 'Cheeseburger';
        }
        $scope.favoriteFood = food;
    }

}]);
Clark.controller('MainCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
    $scope.game = {
        loaded: false,
        dataFile: {},
        data: {}
    };

    $scope.inventoryItems = [
        {
            name: "broadsword",
            damage: 10,
        },
        {
            name: "waterskin",
            damage: 0,
        },
        {
            name: "bedroll",
            damage: 0,
        }
    ]

    function loadFile(file, callback) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = callback;
        reader.onerror = function(){ console.error('Unable to read file'); };
    }

    $scope.loadGameData = function() {
        console.log($scope.game.dataFile);
        loadFile($scope.game.dataFile, function(event) {
            var data = event.target.result;
            try {
                $scope.game.data = JSON.parse(data);
                assignDefaultData();
                $timeout(function() {
                    $scope.game.loaded = true;
                });
                console.log($scope.game.data);
            }
            catch(e) {
                console.error(e);
                console.error(data);

                var errorDialog = $mdDialog.confirm()
                      .title('Failed to load saved game')
                      .textContent('There appears to be something wrong with your saved game file and it cannot be loaded. You can either close this dialog or start a new game.')
                      .ariaLabel('Failed to load game')
                      .ok('Start a new game')
                      .cancel('Try loading new file');

                $mdDialog.show(errorDialog).then(function() {
                    $scope.newGameData();
                }, function() {
                    //Here's where we could do something if they cancel
                });
            }
            $scope.game.dataFile = {};
        });
    }

    function assignDefaultData() {
        if (typeof $scope.game.data.name == 'undefined') {
            $scope.game.data.name = "New Character";
        }
        if (typeof $scope.game.data.description == 'undefined') {
            $scope.game.data.description = "Fighter";
        }
        if (typeof $scope.game.data.level == 'undefined') {
            $scope.game.data.level = 1;
        }
        if (typeof $scope.game.data.inventory == 'undefined') {
            $scope.game.data.inventory = [0,1];
        }
        // eventually should look at removing obsolete data properties that we dont support anymore to keep the file size down.
    }

    $scope.newGameData = function() {
        $scope.game.data = {};
        assignDefaultData();
        $timeout(function() {
            $scope.game.loaded = true;
        });
    }

    $scope.saveGameData = function() {
        console.log($scope.game.data);

        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([JSON.stringify($scope.game.data)], {type: "application/json"}));
        a.download = "game.json";

        // Append anchor to body.
        document.body.appendChild(a)
        a.click();

        // Remove anchor from body
        document.body.removeChild(a)
    }

}]);
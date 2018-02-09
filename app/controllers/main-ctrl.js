Clark.controller('MainCtrl', ['$scope', '$timeout', '$mdDialog', 'Spell', 'Weapon', 'CharacterClass', function ($scope, $timeout, $mdDialog, Spell, Weapon, CharacterClass) {
    $scope.game = {
        coreDataLoading: true,
        loaded: false,
        error: "",
        dataFile: {},
        data: {},
        coreData: {
            spells: [],
            weapons: [],
            characterClasses: []
        },
        classWeaponOptions: [],
        selectedMainWeapon: 0,
        selectedOffHandWeapon: 0
    };


    function init() {
        Spell.list({}, function(data, error) {
            if (typeof error !== "undefined" && error !== null && error.length) {
                $scope.game.coreData.spells = [];
                $scope.game.error = error;
            }
            else {
                $scope.game.coreData.spells = data;
                $scope.game.error = "";
            }
            spellDataLoaded();
        });
    }

    init();

    function spellDataLoaded() {
        Weapon.list({}, function(data, error) {
            if (typeof error !== "undefined" && error !== null && error.length) {
                $scope.game.coreData.weapons = [];
                $scope.game.error = error;
            }
            else {
                $scope.game.coreData.weapons = data;
                $scope.game.error = "";
            }
            weaponDataLoaded();
        });
    }

    function weaponDataLoaded() {
        CharacterClass.list({}, function(data, error) {
            if (typeof error !== "undefined" && error !== null && error.length) {
                $scope.game.coreData.characterClasses = [];
                $scope.game.error = error;
            }
            else {
                $scope.game.coreData.characterClasses = data;
                $scope.game.error = "";
            }
            coreDataLoaded();
        });
    }

    function coreDataLoaded() {
        $scope.game.coreDataLoading = false;
    }

    $scope.cheese = 'tacos';

    $scope.test = function() {
        Spell.list({}, function(data, error) {
            if (typeof error !== "undefined" && error !== null && error.length) {
                $scope.cheese = error;
            }
            else {
                $scope.cheese = data;
            }

        });

    }

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
        if (typeof $scope.game.data.characterClass == 'undefined') {
            $scope.game.data.characterClass = 0;
        }
        if (typeof $scope.game.data.level == 'undefined') {
            $scope.game.data.level = 1;
        }
        if (typeof $scope.game.data.weapons == 'undefined') {
            $scope.game.data.weapons = [];
        }
        // eventually should look at removing obsolete data properties that we dont support anymore to keep the file size down.
    }

    $scope.newGameData = function() {
        $scope.game.data = {};
        assignDefaultData();
        $scope.changeCharacterClass();
        $timeout(function() {
            $scope.game.loaded = true;
        });
    }

    $scope.changeCharacterClass = function() {
        //to be clear this creates a copy of the characterClass property's value and stores in the variable selectedClassIndex
        //BUT changes to the variable selectedClassIndex do not effect the value of $scope.game.data.characterClass
        //BUTTTTTT if it's an object changes between the two are linked however, if they are any other data types (int, string) they are not linked
        //meaning that this update does not effect $scope.game.data.characterClass
        var selectedClassIndex = $scope.game.data.characterClass;
        if (typeof $scope.game.coreData.characterClasses[selectedClassIndex] === "undefined") {
            selectedClassIndex = 0;
            //updating manually because selectedClassIndex changes do not effect original characterClass property
            $scope.game.data.characterClass = 0;
        }
        var selectedCharacterClass = $scope.game.coreData.characterClasses[selectedClassIndex];
        $scope.game.classWeaponOptions = [];
        for (var i = 0; i < selectedCharacterClass.weaponOptions.length; i++) {
            var thisWeaponOptionId = selectedCharacterClass.weaponOptions[i];
            for (var x = 0; x < $scope.game.coreData.weapons.length; x++) {
                if ($scope.game.coreData.weapons[x].id === thisWeaponOptionId) {
                    var thisWeapon = $scope.game.coreData.weapons[x];
                    $scope.game.classWeaponOptions.push(thisWeapon);
                }
            }
        }
    }

    $scope.changeMainWeapon = function() {
        var selectedMainWeapon = $scope.game.selectedMainWeapon;
        console.log(selectedMainWeapon);
    }

    $scope.changeOffHandWeapon = function() {
        var selectedOffHandWeapon = $scope.game.selectedOffHandWeapon;
        console.log(selectedOffHandWeapon);
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
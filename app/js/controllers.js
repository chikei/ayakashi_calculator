'use strict';

/* Controllers */

function DemonListCtrl($scope) {
    $scope.predicate = ['+demon.attribute'];
    $scope.name = '';
    $scope.attack = '';
    $scope.attackEff = '';
    $scope.defense = '';
    $scope.defenseEff = '';
    $scope.spirit = '';
    $scope.attribute = '0';
    $scope.rarity = '0';
    $scope.skillType = '-1';
    $scope.skillAttribute = '-1';
    $scope.skillTarget = '-1';

    $scope.filter = function (demon) {
        var m = $scope.demons[demon.id];
        var attack = parseInt($scope.attack);
        var defense = parseInt($scope.defense);
        var attackEff = parseInt($scope.attackEff);
        var defenseEff = parseInt($scope.defenseEff);
        var spirit = parseInt($scope.spirit);
        var attribute = parseInt($scope.attribute);
        var rarity = parseInt($scope.rarity);
        var skillType = parseInt($scope.skillType);
        var skillAttribute = parseInt($scope.skillAttribute);
        var skillTarget = parseInt($scope.skillTarget);
        return  (attribute == 0 || m.attribute == attribute) &&
            (rarity == 0 || m.rarity == rarity) &&
            (m.name.zh_TW.indexOf($scope.name) != -1 ||
                m.name.jp.indexOf($scope.name) != -1 ||
                m.name.en.indexOf($scope.name) != -1) &&
            (isNaN(attack) || m.attack >= attack) &&
            (isNaN(attackEff) || m.attackEff >= attackEff) &&
            (isNaN(defense) || m.defense >= defense) &&
            (isNaN(defenseEff) || m.defenseEff >= defenseEff) &&
            (isNaN(spirit) || m.spirit >= spirit) &&
            (skillType == -1 || m.skill.type == skillType) &&
            (skillAttribute == -1 || m.skill.attribute == skillAttribute) &&
            (skillTarget == -1 || m.skill.target == skillTarget)
    };

    $scope.displayImage = function (m) {
        m.display = true;
        m.imageUrl = "http://ayakashi.assets.zgncdn.com/2.15.0/images/monsters/" + m.demon.id + "/v.jpg";
    };

    $scope.hideImage = function (m) {
        m.display = false;
    };

    $scope.order = function (field) {
        var i;
        for (i = 0; i < $scope.predicate.length; ++i) {
            if ($scope.predicate[i].substr(7) == field) {
                switch ($scope.predicate[i].charAt(0)) {
                    case '+':
                        $scope.predicate[i] = '-demon.' + field;
                        break;
                    case '-':
                        $scope.predicate.splice(i, 1);
                        break;
                    default:
                        break;
                }
                return;
            }
        }
        $scope.predicate.push('+demon.' + field);
    };
}

function listDemonCtor(id, data) {
    return {
        id: id,
        demon: data,
        display: false,
        imageUrl: ""
    };
}

function initOwnedList($rootScope, $cookieStore) {
    if (typeof $rootScope.ownedList === 'undefined') {
        $rootScope.ownedList = [];
        var owned = $cookieStore.get('owned');

        if (typeof owned === 'undefined')
            owned = [];

        for (var i = 0; i < owned.length; ++i) {
            $rootScope.ownedList.push(listDemonCtor(owned[i], $rootScope.demons[owned[i]]));
        }
    }
}
function AllListCtrl($scope, $cookieStore, $rootScope, demons) {
    demons.async.then(function (d) {
        $scope.list = [];
        $scope.demons = $rootScope.demons;
        $scope.demonDisplay = {};
        $scope.demonImageUrl = {};

        for (var m in $scope.demons) {
            $scope.list.push(listDemonCtor(m, $scope.demons[m]));
        }

        initOwnedList($rootScope, $cookieStore);
    });

    DemonListCtrl($scope);

    $scope.click = function (id) {
        $rootScope.ownedList.push(listDemonCtor(id, $scope.demons[id]));

        var cookie = [];
        for (var i = 0; i < $rootScope.ownedList.length; ++i) {
            cookie.push($rootScope.ownedList[i].id);
        }
        $cookieStore.put('owned', cookie);
    };

    $scope.clickIcon = 'icon-plus';
}

AllListCtrl.$inject = ['$scope', '$cookieStore', '$rootScope', 'demons'];

function OwnedListCtrl($scope, $cookieStore, $rootScope, demons) {
    demons.async.then(function (d) {
        initOwnedList($rootScope, $cookieStore);

        $scope.list = $rootScope.ownedList;
        $scope.demons = $rootScope.demons;
    });

    DemonListCtrl($scope);

    $scope.click = function (id) {
        for (var i = 0; i < $scope.list.length; ++i) {
            if ($scope.list[i].id == id) {
                $scope.list.splice(i, 1);
                break;
            }
        }

        var cookie = [];
        for (var i = 0; i < $rootScope.ownedList.length; ++i) {
            cookie.push($rootScope.ownedList[i].id);
        }
        $cookieStore.put('owned', cookie);
    };

    $scope.clickIcon = 'icon-minus';
}

OwnedListCtrl.$inject = ['$scope', '$cookieStore', '$rootScope', 'demons'];

function AttackTeamListCtrl($scope, $cookieStore, $rootScope, demons) {
    demons.async.then(function (d) {
        initOwnedList($rootScope, $cookieStore);
        $scope.demons = $rootScope.demons;
        $scope.teams = [
            [
                {
                    id: 497,
                    skill: 3,
                    demon: $scope.demons[497]
                },
                {
                    id: 220,
                    skill: 0,
                    demon: $scope.demons[220]
                },
                {
                    id: 102,
                    skill: 0,
                    demon: $scope.demons[102]
                },
                {
                    id: 102,
                    skill: 0,
                    demon: $scope.demons[102]
                },
                {
                    id: 95,
                    skill: 0,
                    demon: $scope.demons[95]
                }
            ]
        ];
    });

    $scope.calculateAttack = function (demons, demon, demonIndex, from) {
        if (demons.length <= from ||
            typeof demons[from].demon.skill.type === 'undefined' ||
            demons[from].demon.skill.attribute == "4") {
            return 0;
        } else {
            if (demons[from].demon.skill.target == '2') {
                return 0;
            }

            var attr = demons[from].demon.skill.attribute;
            if (parseInt(attr) != demon.demon.attribute && attr != '0') {
                return 0;
            }

            if (demonIndex == from && demon.demon.skill.type != 0) {
                return 0;
            }

            var str = (demons[from].demon.rarity * 2) + 5 + demons[from].skill + parseInt(demons[from].demon.skill.strength);
            return demon.demon.attack * str * 0.01;
        }
    };

    $scope.skillStrength = function (demon) {
        if (typeof demon.demon.skill.type === 'undefined') {
            return "";
        } else {
            return ((demon.demon.rarity * 2) + 5 + demon.skill + parseInt(demon.demon.skill.strength));
        }
    };

    $scope.baseSkillLevel = function (demon) {
        if (typeof demon.demon.skill.type === 'undefined') {
            return "";
        } else {
            return demon.demon.rarity * 2 + 5;
        }
    };

    $scope.addTeam = function () {
    };
}

AttackTeamListCtrl.$inject = ['$scope', '$cookieStore', '$rootScope', 'demons'];
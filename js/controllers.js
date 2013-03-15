'use strict';

/* Controllers */

function DemonListCtrl($scope, demons) {
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

    $scope.generateAtkTeam = function () {
        var a = [];
        for (var i = 0; i < demons.atk.length; ++i) {
            if (demons.atk[i].members.length < 5)
                a.push(i + 1);
        }
        return a;
    };

    $scope.addingAtkTeamIndex = null;

    $scope.addAtkToTeam = function (id) {
        demons.addAtkToTeam($scope.addingAtkTeamIndex - 1, id);
        $scope.addingAtkTeamIndex = null;
    };
}

function AllListCtrl($scope, demons) {
    DemonListCtrl($scope, demons);

    $scope.list = demons.allDemons;

    $scope.demons = demons.demons;

    $scope.click = function (id) {
        demons.addOwned(id);
    };

    $scope.clickIcon = 'icon-plus';
}

AllListCtrl.$inject = ['$scope', 'demons'];

function OwnedListCtrl($scope, demons) {
    DemonListCtrl($scope, demons);

    $scope.list = demons.owned;

    $scope.demons = demons.demons;

    $scope.click = function (id) {
        demons.removeOwned(id);
    };

    $scope.clickIcon = 'icon-minus';
}

OwnedListCtrl.$inject = ['$scope', 'demons'];

function AttackTeamListCtrl($scope, demons) {
    demons.async.then(function (d) {
        $scope.demons = demons.demons;
        $scope.teams = demons.atk
    });
    $scope.addTeam = function () {
        demons.addAtkTeam()
    };

    $scope.setLeader = function (teamIdx, leaderIdx) {
        demons.setAtkLeader(teamIdx, leaderIdx);
    };

    $scope.remove = function (teamIdx, idx){
        demons.removeAtkFromTeam(teamIdx, idx);
    };

    $scope.removeTeam = function (teamIdx){
        demons.removeAtkTeam(teamIdx);
    };
}

AttackTeamListCtrl.$inject = ['$scope', 'demons'];

function AttackTeamCtrl($scope) {
    $scope.init = function (team) {
        $scope.team = team;
    };

    $scope.attack = function (demonIndex, from) {
        var demon = $scope.team.members[demonIndex];
        if ($scope.team.members.length <= from ||
            typeof $scope.team.members[from].demon.skill.type === 'undefined' ||
            $scope.team.members[from].demon.skill.attribute == "4") {
            return 0;
        } else {
            if ($scope.team.members[from].demon.skill.target == '2') {
                return 0;
            }

            var attr = $scope.team.members[from].demon.skill.attribute;
            if (parseInt(attr) != demon.demon.attribute && attr != '0') {
                return 0;
            }

            var str = ($scope.team.members[from].demon.rarity * 2) + 5 + $scope.team.members[from].skill + parseInt($scope.team.members[from].demon.skill.strength);
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

    $scope.leaderIcon = function (idx) {
        if (idx == $scope.team.leader)
            return "icon-star";
        else
            return "icon-star-empty";
    }
}

AttackTeamCtrl.$inject = ['$scope'];
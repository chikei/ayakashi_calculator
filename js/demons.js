'use strict';

angular.module('ayakashi.demons', [], function ($provide) {
    $provide.factory('demons', ['$http', '$rootScope', '$cookieStore', function (http, root, $cookieStore) {
        var demons = {};

        var ownedDemons = [];

        var allDemons = [];

        var atkTeams = [];

        function listDemonCtor(id, demon) {
            return {
                id: id,
                demon: demon,
                display: false,
                imageUrl: ""
            };
        }

        function updateAtkTeam() {
            var cookie = [];
            for (var i = 0; i < atkTeams.length; ++i) {
                var team = atkTeams[i];
                var members = [];
                for (var j = 0; j < team.members.length; ++j) {
                    members.push({
                        id: team.members[j].id,
                        skill: team.members[j].skill
                    });
                }
                cookie.push({
                    leader: team.leader,
                    members: members
                })
            }
            $cookieStore.put('atkTeams', cookie)
        }

        function updateOwned() {
            var cookie = [];
            for (var i = 0; i < ownedDemons.length; ++i) {
                cookie.push(ownedDemons[i].id);
            }
            $cookieStore.put('owned', cookie);
        }

        var promise = http.get('ayakashi.json').success(function (data) {
            var i;
            for (i = 0; i < data.length; ++i) {
                data[i]['attackEff'] = data[i].attack / data[i].spirit;
                data[i]['defenseEff'] = data[i].defense / data[i].spirit;
                demons[data[i].id] = data[i];
            }
        }).then(function (d) {
                for (var m in demons) {
                    allDemons.push(listDemonCtor(m, demons[m]));
                }
            }).then(function (d) {
                var owned = $cookieStore.get('owned');
                if (typeof owned === 'undefined')
                    owned = [];

                for (var i = 0; i < owned.length; ++i) {
                    ownedDemons.push(listDemonCtor(owned[i], demons[owned[i]]));
                }
            }).then(function (d) {
                var atk = $cookieStore.get('atkTeams');
                if (typeof atk === 'undefined')
                    atk = [];

                for (var i = 0; i < atk.length; ++i) {
                    var team = atk[i];
                    var members = [];
                    for (var j = 0; j < team.members.length; ++j) {
                        members.push({
                            id: team.members[j].id,
                            skill: team.members[j].skill,
                            demon: demons[team.members[j].id]
                        });
                    }
                    atkTeams.push({
                        leader: team.leader,
                        members: members
                    })
                }
            });

        return {
            async: promise,
            demons: demons,
            allDemons: allDemons,
            owned: ownedDemons,
            atk: atkTeams,
            removeOwned: function (id) {
                promise.then(function (d) {
                    for (var i = 0; i < ownedDemons.length; ++i) {
                        if (ownedDemons.id == id) {
                            ownedDemons.splice(i, 1);
                            break;
                        }
                    }

                    updateOwned();
                });
            },
            addOwned: function (id) {
                promise.then(function (d) {
                    ownedDemons.push(listDemonCtor(id, demons[id]));
                    updateOwned();
                });
            },
            removeAtkTeam: function (idx) {
                promise.then(function (d) {
                    atkTeams.splice(idx, 1);
                    updateAtkTeam();
                });
            },
            addAtkTeam: function () {
                promise.then(function (d) {
                    atkTeams.push({leader: 0, members: []});
                    updateAtkTeam();
                });
            },
            setAtkLeader: function (teamIdx, leaderIdx) {
                promise.then(function (d) {
                    atkTeams[teamIdx].leader = leaderIdx;
                    updateAtkTeam();
                })
            },
            addAtkToTeam: function (teamIdx, id){
                promise.then(function (d){
                    atkTeams[teamIdx].members.push(
                        {
                            id: id,
                            skill: 0,
                            demon: demons[id]
                        }
                    );
                    updateAtkTeam();
                })
            },
            removeAtkFromTeam: function (teamIdx, id){
                promise.then(function (d){
                    atkTeams[teamIdx].members.splice(id, 1);
                    if(atkTeams[teamIdx].members.length <= atkTeams[teamIdx].leader){
                        atkTeams[teamIdx].leader = 0;
                    }
                    updateAtkTeam();
                })
            }
        };
    }]);
});
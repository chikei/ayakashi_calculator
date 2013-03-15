'use strict';

angular.module('ayakashi.filters', []
    ).filter('attribute',function () {
        return function (input) {
            switch (input) {
                case 1:
                    return '妖';
                case 2:
                    return '神';
                case 3:
                    return '九十九';
                default:
                    return input
            }
        };
    }).filter('rarity',function () {
        return function (input) {
            switch (input) {
                case 1:
                    return '\u2605';
                case 2:
                    return '\u2605\u2605';
                case 3:
                    return '\u2605\u2605\u2605';
                case 4:
                    return '\u2605\u2605\u2605\u2605';
                case 5:
                    return '\u2605\u2605\u2605\u2605\u2605';
                default:
                    return input
            }
        };
    }).filter('attributeToRowClass',function () {
        return function (input) {
            switch (input) {
                case 1:
                    return "error";
                case 2:
                    return "info";
                case 3:
                    return "success";
                default:
                    return "";
            }
        }
    }).filter('displaySkill', ['attributeFilter', function (filter) {
        return function (input) {
            if (typeof input.type === 'undefined') {
                return "";
            } else {
                var type = '';
                var attribute = '';
                var targetAttribute = '';
                switch (input.type) {
                    case 0:
                        return "增加自己攻防";
                    case 1:
                        type = "增加";
                        break;
                    case 2:
                        type = "減少";
                        break;
                    default :
                        type = input.type;
                        break;
                }
                var tmp = parseInt(input.attribute);
                switch(tmp){
                    case 0:
                        attribute = "全員";
                        break;
                    case 1:
                    case 2:
                    case 3:
                        attribute = filter(tmp);
                        break;
                    case 4:
                        attribute = "銀貨";
                        break;
                    default :
                        attribute = input.attribute;
                        break;
                }
                tmp = parseInt(input.target);
                switch(tmp){
                    case 0:
                        targetAttribute = "攻防";
                        break;
                    case 1:
                        targetAttribute = "攻擊力";
                        break;
                    case 2:
                        targetAttribute = "防禦力";
                        break;
                    default :
                        if(typeof input.target !== 'undefined'){
                            targetAttribute = input.target;
                        }
                        break;
                }
                return type + attribute + targetAttribute;
            }
        }
    }]).filter('displayStrength', function(){
        return function(input){
            if (typeof input === 'undefined') {
                return "";
            } else {
                return "SLv + " + input;
            }
        }
    }).filter('baseSkillLevel', function(){
        return function(input){
            if (typeof input.skill.type === 'undefined') {
                return "";
            } else {
                return input.rarity * 2 + 5;
            }
        }
    });
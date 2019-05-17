const config = require('../config');
const util = require('./util');
const fritz = require('smartfritz');

function getCombinations(ids) {
    var results = [];
    var f = (prefix, ids) => {
        for (var i = 0; i < ids.length; i++) {
            results.push(prefix === '' ? ids[i] : prefix + ',' + ids[i]);
            f(prefix === '' ? ids[i] : prefix + ',' + ids[i], ids.slice(i + 1));
        }
    };
    f('', ids);
    return results;
}

function getEnergyLevels() {
    var energyLevels = [/*{
       energy: {min: 0, max: 2000},
       run: []
    }*/];

    var deviceData = util.getFileContents('devices.txt');
    if (deviceData === '[]')
        return energyLevels;

    var deviceIds = [], devices = [];
    var deviceArray = JSON.parse(deviceData);

    for (var d = 0, n = deviceArray.length; d < n; d++) {
        var device = deviceArray[d];
        if (device != null) {
            var id = device.id + '';
            deviceIds.push(id);
            devices[id] = device;
        }
    }

    var combinations = getCombinations(deviceIds);
    for (var a = 0; a < combinations.length; a++) {
        var combination = combinations[a].split(',');
        var min = 0, max = 0;
        var names = [];

        for (var c = 0; c < combination.length; c++) {
            var combinationId = combination[c];
            device = devices[id + ''];
            min += (parseInt(device.min) * 1000);
            max += (parseInt(device.max) * 1000);
            names.push(device.name);
        }

        var inserted = false;
        for (var l = 0; l < energyLevels.length; l++) {
            var level = energyLevels[l];
            if (level.energy.min > 0 && min > level.energy.min) {
                energyLevels.splice(l, 0, {
                   energy: {
                       min: min,
                       max: max
                   },
                    run: names
                });
                inserted = true;
                break;
            }
        }

        if (inserted === false) {
            energyLevels.push({
                energy: {
                    min: min,
                    max: max
                },
                run: names
            });
        }
    }

    return energyLevels;
}

var energyLevel = [
    {
        energy: {min: 0, max: 2000},
        run: []
    },
    {
        energy: {min: 2400000, max: 2590000},
        run: ['Wasserkocher', "Kaffemaschine"]
    },
    {
        energy: {min: 1700000, max: 1900000},
        run: ["Wasserkocher"]
    },
    {
        energy: {min: 700000, max: 800000},
        run: ["Kaffemaschine"]
    }
];

var energyLevels = getEnergyLevels();
if(energyLevels.length > 1) {
    energyLevel = energyLevels;
}

function fetchDataFromFRITZ() {
    var moreParam = {url: config.host};
    fritz.getSessionID(config.user, config.pass, (sid) => {
        fritz.getSwitchList(sid, (listinfos) => {
            fritz.getSwitchPower(sid, listinfos, (energy) => {
                if (energy === '')
                    energy = '0';

                if (energy != 0)
                    console.log(energy);

                var notifyContent = util.getFileContents('notify.txt');
                var lastNotification = JSON.parse(notifyContent === '[]' ? '{}' : notifyContent);
                var result = null;

                for (var index = 0; index < energyLevel.length; index++) {
                    var element = energyLevel[index];
                    if (element.energy.min <= energy && element.energy.max >= energy) {
                        var timeIns = Date.now();
                        if(lastNotification.time > 0 && timeIns > lastNotification.time + config.delay) {
                            if(lastNotification.level === index) {
                                result = element.run;
                                lastNotification.valid = true;
                            } else {
                                lastNotification.valid = false;
                            }
                        }

                        lastNotification.level = index;
                        lastNotification.time = timeIns;
                        lastNotification.power = energy;
                        lastNotification.devices = [];
                        break;
                    }
                }

                var lastNotificationString = JSON.stringify(lastNotification);
                var resultString = JSON.stringify(result);

                util.saveToFile('notify.txt', lastNotificationString);
                if (resultString && lastNotification.valid)
                    util.saveToFile('state.txt', resultString);
            }, moreParam);
        }, moreParam);
    }, moreParam);
}

module.exports = {
    fetchDataFromFRITZ: fetchDataFromFRITZ
};
/**
 * smarter power point
 * @author: info@orcas.de
 */

var config = require('./config');

var fs = require('fs');

function getCombinations(ids) {
    var result = [];
    var f = function(prefix, ids) {
        for (var i = 0; i < ids.length; i++) {
            result.push(prefix == '' ? ids[i] : prefix + ',' + ids[i]);
            f(prefix == '' ? ids[i] : prefix + ',' + ids[i], ids.slice(i + 1));
        }
    };
    f('', ids);
    return result;
}

function getEnergyLevels() {
    var energyLevels = [{
        energy: {min: 0, max: 2000},
        run: []
    }];
    if(fs.existsSync('devices.txt')) {
        var deviceIds = [];
        var deviceArray = JSON.parse(fs.readFileSync('devices.txt', 'utf-8'));
        var devices = [];
        for (var d=0, n=deviceArray.length; d < n; d++) {
            var dev = deviceArray[d];
            if (dev != null) {
                deviceIds.push(dev.id + '');
                devices[dev.id + ''] = dev;
            }
        }
        var allCombinations = getCombinations(deviceIds);
        for (var a=0, an=allCombinations.length; a < an; a++) {
            var combination = allCombinations[a].split(',');
            var min = 0;
            var max = 0;
            var names = [];
            for (var c=0, cn=combination.length; c < cn; c++) {
                var id=combination[c];
                dev = devices[id + ''];
                min += (parseInt(dev.min) * 1000);
                max += (parseInt(dev.max) * 1000);
                names.push(dev.name);
            }
            var inserted = false;
            for (var l=0, en=energyLevels.length; l < en; l++) {
                var level = energyLevels[l];
                if(level.energy.min > 0 && min > level.energy.min) {
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
            if(inserted == false) {
                energyLevels.push({
                    energy: {
                        min: min,
                        max: max
                    },
                    run: names
                });
            }
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
var lastNotification = {
    time: 0,
    level: 0,
    valid: false,
    power: 0
};
var cron = require('node-cron');

cron.schedule('*/10 * * * * *', function () {
    var fritz = require('smartfritz');

    var moreParam = {url: config.host};
    fritz.getSessionID(config.user, config.pass, function (sid) {
        fritz.getSwitchList(sid, function (listinfos) {
            fritz.getSwitchPower(sid, listinfos, function (sid) {
                if(fs.existsSync('notify.txt')) {
                    lastNotification = JSON.parse(fs.readFileSync('notify.txt', 'utf-8'));
                }

                var result = null;
                for (var index = 0; index < energyLevel.length; index++) {
                    var element = energyLevel[index];
                    if (element.energy.min <= sid && element.energy.max >= sid) {
                        var timeIns = Date.now();
                        if(lastNotification.time > 0 && timeIns > lastNotification.time + config.delay) {
                            if(lastNotification.level == index) {
                                result = element.run;
                                lastNotification.valid = true;
                            } else {
                                lastNotification.valid = false;
                            }
                        }
                        lastNotification.level = index;
                        lastNotification.time = timeIns;
                        lastNotification.power = sid;
                        break;
                    }
                }
                fs.writeFile('notify.txt', JSON.stringify(lastNotification), function (err) {});
                if (result && lastNotification.valid) {
                    fs.writeFile('state.txt', JSON.stringify(result), function (err) {});
                }
            }, moreParam);
        }, moreParam);
    }, moreParam);
});
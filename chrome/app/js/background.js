var powerPoint = {
    devices: [],
    config: null
};
var running = [];

Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0;
    });
};

Array.prototype.find = function(name, value) {
    return this.filter(function(item) {
        var val = item[name];
        return val == value;
    });
};

function send(aUrl, aCallBack, aData) {
    if(aUrl.length != 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", aUrl);
        xmlhttp.onload = aCallBack;
        xmlhttp.send(aData);
    }
}

function checkCoffee() {
    if(powerPoint.url.length == 0) {
        window.setTimeout(checkCoffee, 1);
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", powerPoint.url);
    xmlhttp.onload = function(e) {
        var response = JSON.parse(e.target.responseText);

        var diff = running.diff(response);
        var diff2 = response.diff(running);

        if(powerPoint.devices.length > 0) {
            for(var index = 0; index < diff.length; index++) {
                var element = diff[index];
                var dev = powerPoint.devices.find('name', element)[0];
                // if(dev.state == 2 || dev.state == 3) {
                if (typeof dev != 'undefined' && typeof element != 'undefined') {
                    showNotification(element, dev.endText, dev.endSound);
                }
                // }
            }

            for(var index2 = 0; index2 < diff2.length; index2++) {
                var element2 = diff2[index2];
                var dev2 = powerPoint.devices.find('name', element2)[0];
                // if(dev2.state == 1 || dev2.state == 3) {
                if (typeof dev2 != 'undefined' && typeof element2 != 'undefined') {
                    showNotification(element2, dev2.startText, dev2.endSound);
                }
                //}
            }
        }

        running = response;

        window.setTimeout(checkCoffee, 10000);
    };
    xmlhttp.send();
}

function showNotification(element, text, sound) {
    if(sound) {
        var audio = new Audio();
        audio.src = sound;
        audio.play();
    }
    chrome.notifications.create('Küche', {
        type: 'basic',
        iconUrl: powerPoint.devices.find('name', element)[0].img,
        title: element,
        message: text
    });
}

function getDevices(e) {
    var devices = JSON.parse(e.target.responseText);
    if(devices !== null && typeof devices === 'object') {
        powerPoint.devices = devices;
        if(powerPoint.config) {
            var ids = powerPoint.config.ids.split(",");
            var options = JSON.parse(powerPoint.config.options);
            for (var i=0, n=ids.length; i < n; i++) {
                var id = ids[i];
                var dev = powerPoint.devices.find('id', id);
                if(dev !== null) {
                    dev[0]['state'] = options[id];
                }
            }
        }
    }
}

function restore_options() {
    chrome.storage.sync.get({
        ids: '',
        options: '',
        url: ''
    }, function(config) {
        powerPoint.config = config;
        powerPoint.url = config.url + '/coffee-time.php';
        send(config.url + '/coffee-time.php?get=devices', getDevices);
    });
}

chrome.storage.sync.get({
    ids: '',
    options: '',
    url: ''
}, function(config) {
    powerPoint.config = config;
    powerPoint.url = config.url + '/coffee-time.php';
    checkCoffee();
    window.setInterval(restore_options, 5000);
});

if(chrome.app.runtime) {
    chrome.app.runtime.onLaunched.addListener(function() {
        chrome.app.window.create("html/options.html");
    });
}

var running = [];
var url = '';
var data = {
    Wasserkocher: {
        state: 0,
        img: 'img/water.jpg',
        start: {
            text: 'Wasser wurde aufgesetzt.',
            sound: 'audio/start.mp3'
        },
        end: {
            text: 'Wasserkocher ist fertig.',
            sound: 'audio/finished.mp3'
        }
    },
    Kaffemaschine: {
        state: 0,
        img: 'img/coffee.jpg',
        start: {
            text: 'Kaffe wurde aufgesetzt.',
            sound: 'audio/start.mp3'
        },
        end: {
            text: 'Kaffee ist fertig.',
            sound: 'audio/finished.mp3'
        }
    }
};

//start Coffee Check
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

function checkCoffee() {
    if(url.length == 0) {
        window.setTimeout(checkCoffee, 1);
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url);
    xmlhttp.onload = function (e) {
        var response = JSON.parse(e.target.responseText);

        var diff = running.diff(response);
        var diff2 = response.diff(running);

        for (var index = 0; index < diff.length; index++) {
            var element = diff[index];
            if(data[element].state == 2 || data[element].state == 3)
                showNotification(element, data[element].end.text, data[element].end.sound);
        }

        for (var index2 = 0; index2 < diff2.length; index2++) {
            var element2 = diff2[index2];
            if(data[element2].state == 1 || data[element2].state == 3)
                showNotification(element2, data[element2].start.text, data[element2].start.sound);
        }

        running = response;

        window.setTimeout(checkCoffee, 10000);
    };
    xmlhttp.send();
}

function showNotification(element, text, sound) {
    // Now create the notification
    if(sound) {
        var audio = new Audio();
        audio.src = sound;
        audio.play();
    }
    chrome.notifications.create('Küche', {
        type: 'basic',
        iconUrl: data[element].img,
        title: element,
        message: text
    });
}

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("html/options.html");
});

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        coffee: '0',
        water: '0',
        url:''
    }, function(items) {
        data['Wasserkocher'].state = items.water;
        data['Kaffemaschine'].state = items.coffee;
        url = items.url + '/coffee-time.php';
    });
}
//the starter
chrome.storage.sync.get({
    coffee: '0',
    water: '0',
    url:''
}, function(items) {
    data['Wasserkocher'].state = items.water;
    data['Kaffemaschine'].state = items.coffee;
    url = items.url + '/coffee-time.php';
    checkCoffee();
    window.setInterval(restore_options, 5000);
});
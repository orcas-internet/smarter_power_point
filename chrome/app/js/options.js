$ = jQuery.noConflict();

var DEVICES = [];
var CONFIG = null;

function send(aRequestType, aUrl, aCallBack, aData) {
    if(aUrl.length != 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(aRequestType, aUrl);
        if (aRequestType==='POST')
            xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.onload = aCallBack;
        xmlhttp.send(aData);
    }
}

function updateDevices(e) {
    var url = document.getElementById('input-url').value;
    var devices = JSON.parse(e.target.responseText);
    if(devices !== null && typeof devices === 'object') {
        DEVICES = devices;
        var list = "";
        var notifications = "";
        for(var d = 0, n = DEVICES.length; d < n; d++) {
            var dev = DEVICES[d];
            if(dev != null) {
                list += "<div class='row'>";
                list += "<div class='cell devId'>" + dev.id + "</div>";
                list += "<div class='cell devName'>" + dev.name + "</div>";
                list += "<div class='cell devMin'>" + dev.min + "</div>";
                list += "<div class='cell devMax'>" + dev.max + "</div>";
                list += "<div class='cell devImg'>" + dev.img + "</div>";
                list += "<div class='cell devStartText'>" + dev.startText + "</div>";
                list += "<div class='cell devStartSound'>" + dev.startSound + "</div>";
                list += "<div class='cell devEndText'>" + dev.endText + "</div>";
                list += "<div class='cell devEndSound'>" + dev.endSound + "</div>";
                list += "</div>";

                notifications += "<label for=\"option" + dev.id + "\">" + dev.name + "</label>";
                notifications += "<select id=\"option" + dev.id + "\" style=\"width: 200px;\">";
                notifications += "<option value=\"0\">Keine</option>";
                notifications += "<option value=\"1\">Start</option>";
                notifications += "<option value=\"2\">Fertig</option>";
                notifications += "<option value=\"3\">Start + Fertig</option>";
                notifications += "</select>";
            } else {
                DEVICES.splice(d, 1);
                d--;
                n--;
            }
        }
        $('#devs').empty().append(list).find('.cell').on('click', function() {
            $(this).parent().siblings().removeClass('active');
            $(this).parent().addClass('active');
            addDevice();
        });
        $('#notifications').empty().append(notifications);
        if (CONFIG != null) {
            $('#input-url').val(CONFIG.url);
            var ids = CONFIG.ids.split(",");
            var options = JSON.parse(CONFIG.options);
            for (var i=0, ni=ids.length; i < ni; i++) {
                var id = ids[i];
                $('#option' + id).val(options[id]);
            }
        }
    }
}

function saveDevice() {
    var url = $('#input-url').val();
    if(DEVICES !== null && typeof DEVICES === 'object') {
        var id = $('#devId').val();
        var dev = null;
        var nMaxId = -1;
        if(DEVICES.length > 0) {
            for(var d = 0, n = DEVICES.length; d < n; d++) {
                dev = DEVICES[d];
                if(dev != null) {
                    if(id != "" && dev.id == id) {
                        break;
                    } else {
                        nMaxId = Math.max(nMaxId, dev.id);
                        dev = null;
                    }
                }
            }
            if(dev == null) {
                id=nMaxId+1;
            }
        } else {
            id=0;
        }
        dev = {id: id};
        dev['name'] = $('#devName').val();
        dev['min'] = $('#devMin').val();
        dev['max'] = $('#devMax').val();
        dev['img'] = $('#devImg').val();
        dev['startText'] = $('#devStartText').val();
        dev['startSound'] = $('#devStartSound').val();
        dev['endText'] = $('#devEndText').val();
        dev['endSound'] = $('#devEndSound').val();
        DEVICES[id] = dev;
        var data = new FormData();
        var devices = [];
        var d1 = 0;
        for (var d=0, n=DEVICES.length; d < n; d++) {
            dev = DEVICES[d];
            if (dev != null) {
                devices[d1++] = dev;
            }
        }
        data.append('devices', JSON.stringify(DEVICES));

        var object = {};
        data.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);
        console.log(json);
        send("POST", url + '/set/devices', 'updateDevices', JSON.stringify(object));
        hideDevice();
    }
}

function showDevice() {
    $('label[for="modifyDev"]').show();
    $('#modifyDev').show();
}

function hideDevice() {
    $('label[for="modifyDev"]').hide();
    $('#modifyDev').hide();
}

function addDevice(e) {
    showDevice();
    if(e !== undefined && e.target.nodeName == "BUTTON") {
        $('#devs .row').removeClass('active');
        $('#devId').val("");
        $('#devName').val("");
        $('#devMin').val("");
        $('#devMax').val("");
        $('#devImg').val("");
        $('#devStartText').val("");
        $('#devStartSound').val("");
        $('#devEndText').val("");
        $('#devEndSound').val("");
    } else {
        $('#devs .active').each(function() {
            $('#devId').val($(this).find('.devId').text());
            $('#devName').val($(this).find('.devName').text());
            $('#devMin').val($(this).find('.devMin').text());
            $('#devMax').val($(this).find('.devMax').text());
            $('#devImg').val($(this).find('.devImg').text());
            $('#devStartText').val($(this).find('.devStartText').text());
            $('#devStartSound').val($(this).find('.devStartSound').text());
            $('#devEndText').val($(this).find('.devEndText').text());
            $('#devEndSound').val($(this).find('.devEndSound').text());
        });
    }
}

function delDevice() {
    var url = document.getElementById('input-url').value;
    if(DEVICES !== null && typeof DEVICES === 'object') {
        var id = document.getElementById('devId').value;
        for (var d=0, n=DEVICES.length; d < n; d++) {
            var dev = DEVICES[d];
            if (dev.id == id) {
                DEVICES.splice(d, 1);
                var data = new FormData();
                data.append('devices', JSON.stringify(DEVICES));
                var object = {};
                data.forEach(function(value, key){
                    object[key] = value;
                });
                var json = JSON.stringify(object);
                send("POST", url + '/set/devices', updateDevices, json);
                hideDevice();
                break;
            }
        }
    }
}

function updateState(e) {
    var response = JSON.parse(e.target.responseText);
    if(response !== null) {
        if(typeof response === 'object') {
            var date = new Date(response.time);
            document.getElementById('time').innerHTML = date.toLocaleString();
            document.getElementById('energyLevel').innerHTML = response.level;
            document.getElementById('power').innerHTML = parseFloat(response.power / 1000).toLocaleString('de-DE', { style: 'decimal', useGrouping: true }) + " W";
            document.getElementById('devices').innerHTML = response.devices.join(", ")
        } else {
            document.getElementById('devices').innerHTML = response.join(", ");
        }
    }
}


// Saves options to chrome.storage.sync.
function save_options() {
    var data = {};
    var ids = [];
    var options = [];
    $('#notifications select').each(function() {
        var option = $(this).attr('id');
        var id = option.substr(6);
        ids.push(id);
        options[id + ""] = $(this)[0].selectedIndex;
    });
    data['ids'] = ids.join(",");
    data['options'] = JSON.stringify(options);
    data['url'] = $('#input-url').val();
    chrome.storage.sync.set(data, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.style.display = "block";
        status.textContent = 'Optionen gespeichert.';
        setTimeout(function() {
            status.textContent = '';
            status.style.display = "none";
        }, 750);
    });
}

function restore_options(withDevices) {
    chrome.storage.sync.get({
        ids: '',
        options: '',
        url: ''
    }, function(config) {
        CONFIG = config;
        send("GET", config.url + '/get/all', updateState);
        if(withDevices === true || withDevices.target != null) {
            send("GET", config.url + '/get/devices', updateDevices);
        }
    });
    window.setTimeout(restore_options, 5000, false);
}

$(document).ready(function() {
    $('#notificationbtn').on('click', function () {
        chrome.notifications.create('Küche', {
            type: 'basic',
            iconUrl: '../img/coffee.jpg',
            title: 'Title',
            message: 'Message'
        });
    });

    $('#addDevBtn').on('click', addDevice);
    $('#delDevBtn').on('click', delDevice);
    $('#saveDevBtn').on('click', saveDevice);
    $('#cancelDevBtn').on('click', hideDevice);
    $('#saveBtn').on('click', save_options);
    $('#updateBtn').on('click', restore_options);
    restore_options(true);
});
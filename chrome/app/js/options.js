$ = jQuery.noConflict();

var DEVICES = [];
var CONFIG = null;

function send(aUrl, aCallBack, aData) {
    if(aUrl.length != 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", aUrl);
        xmlhttp.onload = aCallBack;
        xmlhttp.send(aData);
    }
}

function receive(e) {
    console.log(e.target.responseText);
}

function getDevices(e) {
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
                list += "<div class='cell id'>" + dev.id + "</div>";
                list += "<div class='cell name'>" + dev.name + "</div>";
                list += "<div class='cell min'>" + dev.min + "</div>";
                list += "<div class='cell max'>" + dev.max + "</div>";
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
                $('#option' + id)[0].selectedIndex = options[id];
            }
        }
    }
}

function saveDevice() {
    var url = document.getElementById('input-url').value;
    if(DEVICES !== null && typeof DEVICES === 'object') {
        var id = document.getElementById('devId').value;
        var name = document.getElementById('devName').value;
        var min = document.getElementById('minPower').value;
        var max = document.getElementById('maxPower').value;
        var dev = null;
        var nMaxId = -1;
        if(DEVICES.length > 0) {
            for(var d = 0, n = DEVICES.length; d < n; d++) {
                dev = DEVICES[d];
                if(dev != null) {
                    if(dev.id == id) {
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
        dev['name'] = name;
        dev['min'] = min;
        dev['max'] = max;
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
        data.append('devices', JSON.stringify(devices));
        send(url + '/coffee-time.php?set=devices', 'getDevices', data);
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
        $('#minPower').val("");
        $('#maxPower').val("");
    } else {
        $('#devs .active').each(function() {
            $('#devId').val($(this).find('.id').text());
            $('#devName').val($(this).find('.name').text());
            $('#minPower').val($(this).find('.min').text());
            $('#maxPower').val($(this).find('.max').text());
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
                send(url + '/coffee-time.php?set=devices', getDevices, data);
                hideDevice();
                break;
            }
        }
    }
}

function readState(e) {
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

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        ids: '',
        options: '',
        url: ''
    }, function(config) {
        console.log(config);
        CONFIG = config;
        send(config.url + '/coffee-time.php?get=all', readState);
        send(config.url + '/coffee-time.php?get=devices', getDevices);
    });
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

$(document).ready(function() {
    restore_options();
    $('#saveBtn').on('click', save_options);
    $('#updateBtn').on('click', restore_options);
    $('#addDevBtn').on('click', addDevice);
    $('#delDevBtn').on('click', delDevice);
    $('#saveDevBtn').on('click', saveDevice);
    $('#cancelDevBtn').on('click', hideDevice);
});
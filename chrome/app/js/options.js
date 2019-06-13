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
    var devices = JSON.parse(e.target.responseText);
    if(devices !== null && typeof devices === 'object') {
        DEVICES = devices;
        var list = "";
        var notifications = "";
        for(var d = 0, n = DEVICES.length; d < n; d++) {
            var dev = DEVICES[d];
            if(dev != null) {
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
    $('#saveBtn').on('click', save_options);
    $('#updateBtn').on('click', restore_options);
    restore_options(true);
});

var authenticated = false;
var DEVICES = [];
var CONFIG = [];
var url = '';

function authenticate(url, username, sha1password) {
    authenticated = false;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onload = () => {
        if (xmlhttp.status === 200)
            authenticated = true;
        if (authenticated) {
            $('#auth-indicator').html('Authentication Succeeded');
            $('#delDevBtn').attr('disabled', false);
            $('#addDevBtn').attr('disabled', false);
        } else {
            $('#auth-indicator').html('Authentication Failed');
            $('#delDevBtn').attr('disabled', true);
            $('#addDevBtn').attr('disabled', true);
        }
    };
    xmlhttp.send(JSON.stringify({username: username, password: sha1password}));
}

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
    // var url = document.getElementById('input-url').value;
    console.log(e.target.responseText);
    if (e.target.responseText !== 'Created') {
        var devices = JSON.parse(e.target.responseText);
        if (devices !== null && typeof devices === 'object') {
            DEVICES = devices;
            var list = "";
            var notifications = "";
            for (var d = 0, n = DEVICES.length; d < n; d++) {
                var dev = DEVICES[d];
                if (dev != null) {
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
                    notifications += "</select><br>";
                } else {
                    DEVICES.splice(d, 1);
                    d--;
                    n--;
                }
            }
            $('#devs').empty().append(list).find('.cell').on('click', function () {
                $(this).parent().siblings().removeClass('active');
                $(this).parent().addClass('active');
                addDevice();
            });
            $('#notifications').empty().append(notifications);
            if (CONFIG != null) {
                $('#input-url').val(CONFIG.url);
                var ids = CONFIG.ids.split(",");
                var options = JSON.parse(CONFIG.options);
                for (var i = 0, ni = ids.length; i < ni; i++) {
                    var id = ids[i];
                    $('#option' + id).val(options[id]);
                }
            }
        }
    }
}

function saveDevice() {
    // var url = $('#input-url').val();
    if (DEVICES !== null && typeof DEVICES === 'object') {
        var id = $('#devId').val();
        var dev = null;
        var nMaxId = -1;
        if (DEVICES.length > 0) {
            for (var d = 0, n = DEVICES.length; d < n; d++) {
                dev = DEVICES[d];
                if (dev != null) {
                    if (id != "" && dev.id == id) {
                        break;
                    } else {
                        nMaxId = Math.max(nMaxId, dev.id);
                        dev = null;
                    }
                }
            }
            if (dev == null) {
                id = nMaxId + 1;
            }
        } else {
            id = 0;
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
        for (var d = 0, n = DEVICES.length; d < n; d++) {
            dev = DEVICES[d];
            if (dev != null) {
                devices[d1++] = dev;
            }
        }
        data.append('devices', JSON.stringify(DEVICES));

        var object = {};
        data.forEach(function (value, key) {
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
    if (e !== undefined && e.target.nodeName == "BUTTON") {
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
        $('#devs .active').each(function () {
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
    if (DEVICES !== null && typeof DEVICES === 'object') {
        var id = document.getElementById('devId').value;
        for (var d = 0, n = DEVICES.length; d < n; d++) {
            var dev = DEVICES[d];
            if (dev.id == id) {
                DEVICES.splice(d, 1);
                var data = new FormData();
                data.append('devices', JSON.stringify(DEVICES));
                var object = {};
                data.forEach(function (value, key) {
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

function sha1(str) {
    var rotate_left = function (n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    var cvt_hex = function (val) {
        var str = '';
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    // str = utf8_encode(str);
    var str_len = str.length;

    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) {
        word_array.push(0);
    }

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = word_array[blockstart + i];
        }
        for (i = 16; i <= 79; i++) {
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
}

function doAuthentication() {
    var username = $('#username').val();
    var password = $('#password').val();
    chrome.storage.sync.set({username: username, password: password});

    authenticate(url + '/authenticate', username, sha1(password));

 }

 function restoreOptions() {
     chrome.storage.sync.get({
         ids: '',
         options: '',
         url: '',
         username: '',
         password : ''
     }, function(result) {
         CONFIG = result;
         $('#username').val(result.username);
         $('#password').val(result.password);
         url = result.url;
         send("GET", url + '/get/devices', updateDevices);

         // auto-authentication if username and password are set to provide simple usage
         if (result.username !== undefined && result.password !== undefined)
             doAuthentication();

         // window.setTimeout(restoreOptions, 5000, false);
     });
 }

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
    console.log(JSON.stringify(options));
    data['ids'] = ids.join(",");
    data['options'] = JSON.stringify(options);
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
    $('#addDevBtn').on('click', addDevice);
    $('#delDevBtn').on('click', delDevice);
    $('#saveDevBtn').on('click', saveDevice);
    $('#cancelDevBtn').on('click', hideDevice);
    $('#auth-btn').on('click', doAuthentication);
    $('#saveBtn').on('click', save_options);
    $('#updateBtn').on('click', restoreOptions);

    restoreOptions();
});

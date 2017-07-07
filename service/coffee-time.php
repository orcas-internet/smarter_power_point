<?php
function getAll() {
    $content = file_get_contents(__DIR__ . '/notify.txt');
    $notify  = json_decode($content, true);
    $content = file_get_contents(__DIR__ . '/state.txt');
    $notify['devices'] = json_decode($content);
    return json_encode($notify);
}

function getNotify() {
    return file_get_contents(__DIR__ . '/notify.txt');
}

function getState() {
    return file_get_contents(__DIR__ . '/state.txt');
}

function getDevices() {
    $content = file_get_contents(__DIR__ . '/devices.txt');
    if($content !== false && $content != "") {
        return $content;
    }
    return "[]";
}

function setDevices() {
    $devices = $_REQUEST['devices'];
    if($devices != "") {
        $result = file_put_contents(__DIR__ . '/devices.txt', $devices);
        if($result !== false) {
            return $devices;
        }
    }
    return "[]";
}

if(isset($_REQUEST['get']) && $_REQUEST['get'] != "") {
    if($_REQUEST['get'] == "devices") {
        echo getDevices();
    } else if($_REQUEST['get'] == "all") {
        echo getAll();
    } else if($_REQUEST['get'] == "notify") {
        echo getNotify();
    } else {
        echo getState();
    }
} else if(isset($_REQUEST['get']) && $_REQUEST['set'] != "") {
    if($_REQUEST['set'] == "devices") {
        echo setDevices();
    }
} else {
    echo getState();
}
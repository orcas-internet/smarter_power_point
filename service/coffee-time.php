<?php
header('Access-Control-Allow-Origin: *');

function getAll() {
    $content = file_get_contents(__DIR__ . '/notify.txt');
    $notify  = json_decode($content, true);
    $content = file_get_contents(__DIR__ . '/state.txt');
    $notify['devices'] = json_decode($content);
    return json_encode($notify);
}

function getContent($filename) {
    try {
        return file_get_contents($filename);
    } catch (Exception $exception) {
        return convertExceptionToJson($exception);
    }
}

function convertExceptionToJson(\Exception $ex) {
    return json_encode(array(
        'error' => array(
            'msg' => $ex->getMessage(),
            'code' => $ex->getCode()
        ),
    ));
}

function getNotify() {
    return getContent(__DIR__ . '/notify.txt');
}

function getState() {
    return getContent(__DIR__ . '/state.txt');
}

function getDevices() {
    $content = getContent(__DIR__ . '/devices.txt');
    if($content !== false && $content != "") {
        return $content;
    }
    return "[]";
}

function setDevices() {
    $devices = $_REQUEST['devices'];
    if($devices != "") {
        try {
            $result = file_put_contents(__DIR__ . '/devices.txt', $devices);
            if($result !== false || $result !== FALSE) {
                return $devices;
            }
        } catch (Exception $exception) {
            return convertExceptionToJson($exception);
        }
    }
    return "[]";
}

set_error_handler(
    function ($severtiy, $message, $file, $line) {
        throw new ErrorException($message, $severtiy, $severtiy, $file, $line);
    }
);

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
} else if(isset($_REQUEST['set']) && $_REQUEST['set'] != "") {
    if($_REQUEST['set'] == "devices") {
        echo setDevices();
    }
} else {
    echo getState();
}
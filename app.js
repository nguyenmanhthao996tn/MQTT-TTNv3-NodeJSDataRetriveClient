/*========== Please modify following configurations according to your TTNv3 Application ==========*/
const MQTT_HOST_URL = "mqtt://au1.cloud.thethings.network:1883";
const USERNAME = "uca-test-app@ttn";
const PASSWORD = "NNSXS.J5BXBUD2HT65QRLJXIWLYHZDTGDGISNFOOOPOAY.ZFB6V5AR4BR3DJA7QL2IRMUSFTWEDN2I4KUBCY64WYGBKRGTG5PQ";

const APP_ID = "uca-test-app";
const DEV_ID = "test-uca-01";

const UPSTREAM_TOPIC = 'v3/' + APP_ID + '@ttn/devices/' + DEV_ID + '/up';
const DOWNSTREAM_TOPIC = 'v3/' + APP_ID + '@ttn/devices/' + DEV_ID + '/down/queued';

var mqtt = require('mqtt');
var client = mqtt.connect(MQTT_HOST_URL, {
    username: USERNAME,
    password: PASSWORD,
    keepalive: 10,
    connectTimeout: 30000,
});

client.on('connect', function () {
    console.log("Connect successfully");

    // Subcribe to uplink stream
    client.subscribe(UPSTREAM_TOPIC);

    // Subcribe to downlink stream
    client.subscribe(DOWNSTREAM_TOPIC);

    // Subcribe to all stream
    client.subscribe('#');
});

client.on('error', function () {
    console.log("Connect failed");
});

client.on('message', function (topic, message, packet) {
    switch (topic) {
        case UPSTREAM_TOPIC:
            var msg_obj = JSON.parse(message);
            console.log('Uplink object: ' + JSON.stringify(msg_obj.uplink_message));
            
            var b = Buffer.from(msg_obj.uplink_message.frm_payload, 'base64');
            console.log('Uplink message: ' + b.toString());
            break;
        case DOWNSTREAM_TOPIC:
            var msg_obj = JSON.parse(message);
            console.log('Downlink object: ' + JSON.stringify(msg_obj.downlink_queued));

            var b = Buffer.from(msg_obj.downlink_queued.frm_payload, 'base64');
            console.log('Uplink message: ' + b.toString());
            break;
        default:
            console.log('========== ERROR MESSAGE! ==========');
            console.log('TOPIC: ' + topic);
            console.log('MESSAGE: ' + message)
            console.log('====================================');
            break;
    }
});

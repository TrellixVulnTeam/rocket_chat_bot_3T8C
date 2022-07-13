const { driver } = require('@rocket.chat/sdk');
const respmap  = require('./reply');
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./notifications.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("connection successful")
})

function add_not(text, roomss, date, cycle){
    db.run(`INSERT INTO notitfications(text, rooms, date, cycle) VALUES(?, ?, ?, ?)`, [text, roomss, date, cycle], function(err) {
        if (err) {
            return console.log(err.message);
        }
    });
};

function check(){
    var alll = []
    db.all("SELECT * FROM notitfications", function(err, rows) {  
        rows.forEach(function (row) {
            alll.push([row.text, row.rooms, row.date, row.cycle]);    // and other columns, if desired
        })  
    });
    console.log(alll)
    return alll

}

// Environment Setup
const USER = 'test_bot';
const PASS = 'Ulyana13Ulyana12';
const BOTNAME = 'Test Bot';
const ROOMS = ['general', 'notific', 'test'];
var myUserId;
var admins = {
    'ir9HWifqKRotTLCekqukB4FvGvqDNgrbjx': 1,
    'qukB4FvGvqDNgrbjxwhwin6s7zEZoEYoAm': 1
};
var stat
var rms = [];
var mssg = '';
var tme = '';


// Bot configuration
const runbot = async () => {
    const conn = await driver.connect({ host: 'localhost:3000'})
    myUserId = await driver.login({ username: USER, password: PASS });
    const roomsJoined = await driver.joinRooms( ROOMS );
    console.log('joined rooms');

    const subscribed = await driver.subscribeToMessages();
    console.log('subscribed');

    const msgloop = await driver.reactToMessages( processMessages );
    console.log('connected and waiting for messages');
}

// Process messages
const processMessages = async(err, message, messageOptions) => {
if (!err) {
    if (message.u._id === myUserId) return;

    console.log('got message ' + message.msg)

    if (message.rid === 'ir9HWifqKRotTLCekqukB4FvGvqDNgrbjx' || message.rid === 'qukB4FvGvqDNgrbjxwhwin6s7zEZoEYoAm'){
        if (message.msg === '!help'){
            await driver.sendToRoomId('set_notification - to set a notification for selected rooms and time', message.rid);
        }
        else if (message.msg === '!set'){
            await driver.sendToRoomId('Select what rooms or users you want to notify \n Format: _$room1, $room2_', message.rid);
            admins[message.rid] = 2;
            console.log(admins[message.rid]);
            console.log(admins[message.rid] === 2)
        }
        else if (message.msg === '!all'){
            await driver.sendToRoomId(check(), message.rid);
        }
        else if (message.msg === '!cancel'){
            await driver.sendToRoomId('You are in home menu \n Send "help" to see whole list of commands', message.rid);
            admins[message.rid] = 1;
        }
        else if (admins[message.rid] === 2){
            if (message.msg.indexOf(',') > -1){
                rms = message.msg.split(",").map(function(item) {
                    return item.trim();
                  });
            }
            else{
                console.log(admins[message.rid])
                rms = [message.msg];
            }
            console.log(rms)
            admins[message.rid] = 3;
            await driver.sendToRoomId('Send a messega you want to send', message.rid);
        }
        else if (admins[message.rid] === 3){
            mssg = message.msg;
            admins[message.rid] = 4;
            await driver.sendToRoomId('Send a time you want to send message \n Format: "$y-$m-$d $h:$m"', message.rid);
        }
        else if (admins[message.rid] === 4){
            tme = new Date(message.msg);
            console.log(Math.abs(new Date() - tme));
            await driver.sendToRoomId("If you want to make this message repetable then send delay between notifications: Format: *1w* or *20d* or *6m* \n If not send *false*");
            await driver.sendToRoomId('Nice! Your message: *'+mssg+'* is going to be in sent in *'+rms+'* at '+tme.toLocaleString(), message.rid);
            admins[message.rid] = 5;
        }
        else if (admins[message.rid] === 5){
            await driver.sendToRoomId('Nice! Your message: *'+mssg+'* is going to be in sent in *'+rms+'* at '+tme.toLocaleString(), message.rid);
            admins[message.rid] = 1;
            add_not(mssg, rms, tme.toLocaleString().toString(), message.msg);
            check();
        }
        else{
            console.log("else");
        }
        console.log("really?")
    }
    async function send_notific(){
        rm.forEach(async function(entry){
            await driver.sendToRoom(entry);
        }
        );
    }

    if (message.msg in respmap) {
        const sentmsg = await driver.sendToRoom(respmap[message.msg], 'general');
    }
    }
};

runbot();
const { SerialPort } = require('serialport')
const path = require('path')
const convertHex = require('convert-hex')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "serial"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL !");
 
    db.query("UPDATE `log` SET `Obstacle`=0,`Temps`=0 WHERE 1", function (err, result) {
        if (err) throw err;
        console.log(`La table log a été reset avec succès !`);
    });
});

const port = new SerialPort({
    path: 'COM8',
    baudRate: 115200,
    autoOpen: true,
}).setEncoding('utf8')

port.on('readable', function () {
    const nombre = port.read()
        if(nombre.startsWith(`[OBSTACLE]`)) {
            const valeur_obstacle = nombre.match(/(\d+)/);
            
            if(valeur_obstacle === null) return;

            db.query(`UPDATE \`log\` SET \`Obstacle\`=${valeur_obstacle[0]}`, function (err, result) {
                if (err) throw err;
                console.log(`[UPDATE] La table obstable a été update avec succès !`);
            });
        }

        if(nombre.startsWith(`[TEMPS]`)) {
            const valeur_temps = nombre.match(/(\d+)/);
            
            if(valeur_temps === null) return;

            db.query(`UPDATE \`log\` SET \`Temps\`=${valeur_temps[0]}`, function (err, result) {
                if (err) throw err;
                console.log(`[UPDATE] La table temps a été update avec succès !`);
            });
        }
})
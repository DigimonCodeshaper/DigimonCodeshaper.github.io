// db_config.js
import mysql from "mysql2";
import fs from "fs";

const db = mysql.createConnection({
    host: "mysql-5dfc229-digimoncode.f.aivencloud.com",
    port: 27622,
    user: "avnadmin",
    password: "AVNS_43fSQp71pTGo-F5aK91",
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false
        // se quiser usar o certificado, adicione:
        // ca: fs.readFileSync("./ca.pem")
    }
});

db.connect(err => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err);
    } else {
        console.log("✅ Conectado ao banco MySQL!");
    }
});

export default db;

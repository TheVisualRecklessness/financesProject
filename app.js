import express from 'express';
import bodyParser from 'body-parser';
import { conf } from "./config.js";
import pg from "pg";

const app = express();
const port = conf.serverPort;
const db = new pg.Client({
    host: conf.host,
    port: conf.port,
    database: conf.database,
    user: conf.user,
    password: conf.password
});
db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentUserId = 0;
var saldoIndividual = 0;

async function sumarSaldoIndividual() {
    try {
        let response = await db.query(
            "SELECT cuentas.saldo "+
            "FROM cuentas "+
            "JOIN usuarios "+
            "ON id_usuario = usuarios.id "+
            "WHERE usuarios.id = $1;",
            [currentUserId]
        );
        let sum = 0;
        response.rows.forEach(saldo => {
            sum+=parseFloat(saldo.saldo);
        });
        return sum;
    } catch (error) {
        console.log(error.message);
    }
}

app.get("/", async (req,res)=>{
    try {
        const users = await db.query(
            "SELECT * FROM usuarios;"
        );
        const result = users.rows;
        res.render("index.ejs", {
            users: result,
            currentUser: currentUserId, 
            infoSaldo: saldoIndividual
        });
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs",{users:error.message});
    }
});

app.post("/user", async (req,res) => {
    currentUserId = req.body.user;
    saldoIndividual = await sumarSaldoIndividual();
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}.`);
});
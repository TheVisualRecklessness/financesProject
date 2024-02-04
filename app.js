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
let currentUserInfo = [];
let saldoIndividual = 0;

async function userInfo() {
    saldoIndividual = 0;
    try {
        let response = await db.query(
            "SELECT usuarios.nombre, cuentas.id as cuenta_id, "+
            "cuentas.nombre as cuenta_nombre, cuentas.saldo "+
            "FROM usuarios "+
            "JOIN cuentas "+
            "ON usuarios.id = cuentas.id_usuario "+
            "WHERE usuarios.id = $1 "+
            "ORDER BY cuenta_id",
            [currentUserId]
        );
        response.rows.forEach(cuenta => {
            saldoIndividual+=parseFloat(cuenta.saldo);
        });
        return response.rows;
    } catch (error) {
        console.log(error.message);
    }
}

async function insertMovimiento(req,res,next){
    if(req.body.tipo) {
        console.log(req.body);
        let data = [
            req.body.tipo,req.body.categoria,
            parseFloat(req.body.importe),req.body.fecha,
            req.body.observacion,currentUserId,
            parseInt(req.body.cuenta)
        ];
        console.log(data);
        try {
            let upMov = await db.query(
                "INSERT INTO movimientos (tipo,categoria,importe,fecha,observacion,id_usuario,id_cuenta) VALUES ($1,$2,$3,$4,$5,$6,$7);",
                data
            );
        } catch (error) {
            console.log(error.message);
        }
    }
    next();
};

app.use(insertMovimiento);

app.get("/", async (req,res)=>{
    try {
        const users = await db.query(
            "SELECT * FROM usuarios;"
        );
        const result = users.rows;
        res.render("index.ejs", {
            users: result,
            currentUser: currentUserId, 
            infoSaldo: saldoIndividual,
            cuentas: currentUserInfo
        });
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs",{users:error.message});
    }
});

app.post("/user", async (req,res) => {
    currentUserId = req.body.user;
    currentUserInfo = await userInfo();
    res.redirect("/");
});

app.post("/ingresos", async (req,res) => {
    let importe = parseFloat(req.body.importe);
    let cuenta = req.body.cuenta;
    try {
        let quSaldo = await db.query(
            "SELECT saldo "+
            "FROM cuentas "+
            "WHERE id=$1",
            [cuenta]
        );
        let antiguoSaldo = parseFloat(quSaldo.rows[0].saldo);
        let nuevoSaldo = importe+antiguoSaldo;
        
        let upSaldo = await db.query(
            "UPDATE cuentas "+
            "SET saldo = $1 "+
            "WHERE id = $2;",
            [importe,cuenta]
        );
        res.redirect("/");
        
    } catch (error) {
      console.log(error.message);  
    } 
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}.`);
});
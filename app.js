import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { conf } from "./config.js";
import pg from "pg";


const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

app.use(session({
    secret: conf.key,
    resave: false,
    saveUninitialized: true
}));

async function getUserInfo(userId) {
    let saldoIndividual = 0;
    try {
        let response = await db.query(
            "SELECT usuarios.nombre, cuentas.id as cuenta_id, "+
            "cuentas.nombre as cuenta_nombre, cuentas.saldo "+
            "FROM usuarios "+
            "JOIN cuentas "+
            "ON usuarios.id = cuentas.id_usuario "+
            "WHERE usuarios.id = $1 "+
            "ORDER BY cuenta_id",
            [userId]
        );

        response.rows.forEach(cuenta => {
            saldoIndividual+=parseFloat(cuenta.saldo);
        });
        return {userInfo: response.rows, saldoIndividual};
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
            req.body.observacion,req.session.currentUserId,
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
    const currentUserId = req.session.currentUserId;
    const {userInfo, saldoIndividual} = await getUserInfo(currentUserId);
    try {
        const users = await db.query(
            "SELECT * FROM usuarios ORDER BY id;"
        );
        const result = users.rows;
        const movements = await db.query(
            "SELECT movimientos.id,movimientos.tipo,movimientos.categoria,movimientos.importe,movimientos.fecha,movimientos.observacion, cuentas.nombre FROM movimientos JOIN cuentas ON movimientos.id_cuenta = cuentas.id WHERE movimientos.id_usuario=$1 ORDER BY id ASC;",
            [currentUserId]
        );
        const datos_mes = await db.query(
            'SELECT egresos_mes($1,$2,$3), ingresos_mes($1,$2,$3), restante($1,$2,$3)',
            [currentUserId,firstDay,lastDay]
        );

        let limite_gasto = 6000;

        let egreso_mes = Math.round((datos_mes.rows[0].egresos_mes)*100)/100;
        let ingreso_mes = Math.round((datos_mes.rows[0].ingresos_mes)*100)/100;
        let restante = Math.round((limite_gasto-(datos_mes.rows[0].restante))*100)/100;

        res.render("index.ejs", {
            users: result,
            currentUser: currentUserId, 
            infoSaldo: saldoIndividual,
            cuentas: userInfo,
            movements: movements.rows,
            egreso_mes: egreso_mes,
            ingreso_mes: ingreso_mes,
            restante: restante
        });

    } catch (error) {
        console.log(error.message);
        res.render("index.ejs",{users:error.message});
    }
});

app.post("/user", async (req,res) => {
    req.session.currentUserId = req.body.user;
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
        let nuevoSaldo = antiguoSaldo+importe;
        
        let upSaldo = await db.query(
            "UPDATE cuentas "+
            "SET saldo = $1 "+
            "WHERE id = $2;",
            [nuevoSaldo,cuenta]
        );
        res.redirect("/");
        
    } catch (error) {
      console.log(error.message);  
    } 
});

app.post("/egresos", async (req,res) => {
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
        let nuevoSaldo = antiguoSaldo-importe;
        
        let upSaldo = await db.query(
            "UPDATE cuentas "+
            "SET saldo = $1 "+
            "WHERE id = $2;",
            [nuevoSaldo,cuenta]
        );
        res.redirect("/");
        
    } catch (error) {
      console.log(error.message);  
    } 
});

app.post("/newCuenta", async (req,res) => {
    let nombre = req.body.newCuentaNombre;
    let saldo = parseFloat(req.body.newCuentaSaldo);
    let currentUserId = req.session.currentUserId;
    try {
        let newCuenta = await db.query(
            "INSERT INTO cuentas (nombre,saldo,id_usuario) VALUES ($1,$2,$3);",
            [nombre,saldo,currentUserId]
        );
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
});

app.post("/transferencias", async (req,res) => {
    let monto = parseFloat(req.body.monto);
    let cuentaOrigen = req.body.cuentaOrigen;
    let cuentaDestino = req.body.cuentaDestino;

    try {
        let data = [
            "Egreso","Transferencia entre cuentas propias",
            monto,req.body.fecha,
            req.body.observacion,req.session.currentUserId,
            parseInt(cuentaOrigen)
        ];
        let upMovOrigen = await db.query(
            "INSERT INTO movimientos (tipo,categoria,importe,fecha,observacion,id_usuario,id_cuenta) VALUES ($1,$2,$3,$4,$5,$6,$7);",
            data
        );

        let quSaldoOrigen = await db.query(
            "SELECT saldo "+
            "FROM cuentas "+
            "WHERE id=$1",
            [cuentaOrigen]
        );
        let antiguoSaldoOrigen = parseFloat(quSaldoOrigen.rows[0].saldo);
        let nuevoSaldoOrigen = antiguoSaldoOrigen-monto;
        
        let upSaldoOrigen = await db.query(
            "UPDATE cuentas "+
            "SET saldo = $1 "+
            "WHERE id = $2;",
            [nuevoSaldoOrigen,cuentaOrigen]
        );

        data = [
            "Ingreso","Transferencia entre cuentas propias",
            monto,req.body.fecha,
            req.body.observacion,req.session.currentUserId,
            parseInt(cuentaDestino)
        ];

        let upMovDestino = await db.query(
            "INSERT INTO movimientos (tipo,categoria,importe,fecha,observacion,id_usuario,id_cuenta) VALUES ($1,$2,$3,$4,$5,$6,$7);",
            data
        );

        let quSaldoDestino = await db.query(
            "SELECT saldo "+
            "FROM cuentas "+
            "WHERE id=$1",
            [cuentaDestino]
        );
        let antiguoSaldoDestino = parseFloat(quSaldoDestino.rows[0].saldo);
        let nuevoSaldoDestino = antiguoSaldoDestino+monto;
        
        let upSaldoDestino = await db.query(
            "UPDATE cuentas "+
            "SET saldo = $1 "+
            "WHERE id = $2;",
            [nuevoSaldoDestino,cuentaDestino]
        );
        res.redirect("/");
        
    } catch (error) {
      console.log(error.message);  
    } 
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}.`);
});
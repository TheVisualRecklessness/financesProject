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
    password:conf.password
});
db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", async (req,res)=>{
    const response = await db.query("SELECT * FROM usuarios WHERE id=1");
    const result = response.rows[0].nombre;
    console.log(result);
    res.render("index.ejs", {data:result});
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}.`);
});
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}.`);
});
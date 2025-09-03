
import bodyParser from 'body-parser';
import express from 'express';
import cobrancasRouter from '../routes/cobrancas';

const app = express();
app.use(bodyParser.json());
app.use('/cobrancas', cobrancasRouter);

app.listen(3000, () => console.log('Backend rodando na porta 3000'));

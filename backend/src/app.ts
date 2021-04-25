import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

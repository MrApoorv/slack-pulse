import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth'
import slackRoutes from './routes/slack';
import { loadTokens } from './storage/storage';
import { loadScheduledMessages, startScheduler } from './storage/scheduler';




dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

loadTokens();
loadScheduledMessages();
startScheduler();

app.use(cors());

app.use(express.json());
app.use('/slack', slackRoutes);
app.use('/', authRoutes)

// Read SSL certs
const key = fs.readFileSync(path.join(__dirname, '..', 'certs', 'localhost-key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '..', 'certs', 'localhost.pem'));

app.get('/', (req, res) => {
  res.send('Slack Connect Backend Running');
});

https.createServer({ key, cert }, app).listen(port, () => {
  console.log(`Slack Server running at https://localhost:${port}`);
});

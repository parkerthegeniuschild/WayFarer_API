import '@babel/polyfill';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express from 'express';
import winston from './logs/winston';
import appRoot from 'app-root-path';

config();

/**
 * we must use require here else morgan will load "default" format
 * which has been deprecated.
 */
const morgan = require('morgan');

import v1Router from './routes/index.routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: winston.stream }));

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.use('/api/v1', v1Router);

// error handler
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', (req, res) =>  {
  res.sendFile(`${appRoot}/client/index.html`)
});

const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port, () => console.log(`App running on ${port}`));

export default app;

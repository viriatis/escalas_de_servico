// server.js
const express = require('express');
const bodyParser = require('body-parser');
var config = require('./config'); // get our config file
var cors = require('cors');

//Imports routes
const gestao = require('./routes/gestao.route');
const nomeacao = require('./routes/nomeacao.route');
const servico = require('./routes/servico.route');
const telegram = require('./routes/telegram.route')
const troca = require('./routes/troca.route')
const unidade = require('./routes/unidade.route')
const user = require('./routes/user.route')
//run rotinas
const rotina = require('./services/rotinas.service')
const boot = require('./boot/boot')
// const googlecalendarapi = require('./services/calendar/calendargoogle')
const telegrambot = require('./services/telegram/telegram.bot')
//End IMPORTS

// initialize our express app
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = config.database;
let mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, {
	useCreateIndex: true, 
	useNewUrlParser: true
 });
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/*
ETC...
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function requireHTTPS(req, res, next) {
	if (req.get('x-site-deployment-id') && !req.get('x-arr-ssl')) {
	  return res.redirect('https://' + req.get('host') + req.url);
	}
	next();
  });

//Use routes
app.use('/gestao', gestao);
app.use('/nomeacao', nomeacao);
app.use('/servico', servico);
app.use('/telegram', telegram)
app.use('/troca', troca)
app.use('/unidade', unidade)
app.use('/user', user)


// catch 404 Errors and Forward them to Error Handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error Handler Function
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = error.status || 500;

	// response to client
	res.status(status).json({
		error: {
			message: error.message
		}
	});

	// show in console
	console.error(err);
});

//End ROUTES

let port = 8080;

app.listen(port, () => {
	console.log('Server is up and running on port number ' + port);
});

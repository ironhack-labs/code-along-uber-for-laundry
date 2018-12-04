const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({path: path.join(__dirname, '.private.env')});
dotenv.config({path: path.join(__dirname, '.public.env')});

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require('connect-flash');


mongoose.connect(process.env.DBURL, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.use(session({
  secret: "uber-laundry",
  cookie: {maxAge: 60000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(cookieParser());

app.use(flash());

require('./passport')(app);

app.use((req,res,next)=>{
  res.locals.user = req.user;
  let messages = [...req.flash('error'),...req.flash('info')];
  //console.log(messages);
  res.locals.messages = messages;
  next();
});

// default value for title local
app.locals.title = 'Uber-Laundry';



const index = require('./routes/index');
app.use('/', index);

const passportRoutes = require('./routes/passportRoutes');
app.use('/', passportRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const laundryRoutes = require('./routes/laundryRoutes');
app.use('/laundry', laundryRoutes);


module.exports = app;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Session = require('cookie-session');
//const flash = require('connect-flash')
require('dotenv').config();
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
// const webrouter = require('./routes/webroutes');
const apirouter = require('./routes/apiroutes');
// const flash = require('express-flash-messages')



//app.use(flash());
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser(process.env.CSECRET));
app.use(Session({
  secret: process.env.CSECRET,
  maxAge: 10 * 60 * 1000,
  httpOnly: true,
  sameSite: 'none',
  // path: '/',
  secure: (process.env.NODE_ENV !== 'development')
  },
));
// app.use(flash({
//   passToView: true
// }))
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport);
// app.use('/', webrouter);
app.use('/api', apirouter);






module.exports = app;
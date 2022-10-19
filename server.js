const app = require('./app');
const db = require('./config/config');
require('dotenv').config()

db.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.log('Error: ' + err ))

db.sync();

app.listen(process.env.PORT || 3001, '0.0.0.0', ()=> {
    console.log(`listening to port ${process.env.PORT || 3001}, at http://localhost:${process.env.PORT || 3001}}`)
})
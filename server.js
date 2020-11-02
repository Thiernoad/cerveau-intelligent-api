const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db= knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1', //localhost
          user : 'postgres', //add your user name for the database here
          password : 'Tidtad22*', //add your correct password in here
          database : 'smart-brain' //add your database name you created here
        }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
//appeler la fonction ici au lieu d’avoir que l’ensemble
//app.post('/signin', signin.handleSignin(db, bcrypt)(req,res))
app.post('/signin', signin.handleSignin(db, bcrypt))
//cette réponse de demande recevra la réponse de demande 
//aussi bien que la base de données se connecte et bcrypt.
//C’est ce que nous avons appelé l’injection de dépendance, nous injectons toutes les dépendances
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})

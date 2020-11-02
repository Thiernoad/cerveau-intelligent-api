const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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


app.get('/',(req, res)=>{
	//res.send('this is working');
	res.send(database.users);
})

/*app.post('/signin',(req, res)=>{
	if(req.body.email === database.users[0].email 
		&& req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}
})*/
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register',(req, res)=>{
	const { email, name, password} =req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx =>{
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
				return trx('users')
				  .returning('*')
				  .insert({
					email:loginEmail[0],
					name:name,
					joined: new Date()
			       })//.then(console.log)
		           .then(user=>{
					//res.json(database.users[database.users.length-1]);
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		
	.catch(err=>res.status(400).json('unable to register'))

})

app.get('/profile/:id', (req, res) =>{
	const {id}=req.params;
	//let found = false;

	db.select('*').from('users').where({id})
	.then(user => {
		//console.log(user)
		if(user.length){
			res.json(user[0])
		}else{
			res.status(400).json('not found')
		}
		//console.log(user[0]);
	})
	.catch(err=>res.status(400).json('error getting user'))
	
})

//pour mettre à jour l’utilisateur afin d’augmenter
//' entrées' compter. Chaque fois qu’ils soumettent une image

app.put('/image',(req,res)=>{
	const {id} = req.body;
  db('users').where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries =>{
  	//console.log(entries);
  	res.json(entries[0]);
  })
  .catch(err=>res.status(400).json('unable to get entries'))
})


app.listen(3000,()=>{
	console.log('app is running on port 3000');
})

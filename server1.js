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

//console.log(db.select('*').from('users'));
//db.select('*').from('users').then(user => {
//	console.log(user);
//});

const app = express();

const database ={
	//nb:nous ne stockons jamais de mots de passe comme des textes simples
	// comme celui-ci, tout comme une chaîne dans notre base de données.
	users:[
		{
			id:'123',
			name:'Diallo',
			password:'cookies',
			email: 'diallo@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id:'124',
			name:'Sally',
			password:'bananas',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}

	  ],
	  login:[
	  	{
	  		id: '987',
	  		has:'',
	  		email:'diall@gmail.com'
	  	}

	  ]
}

app.use(cors())
app.use(bodyParser.json());


app.get('/',(req, res)=>{
	//res.send('this is working');
	res.send(database.users);
})

app.post('/signin',(req, res)=>{
		/*// Load hash from your password DB.
	bcrypt.compare("apples", '$2a$10$xChMvPzqG1O5irPDjfHUeO9KrysSsi4KS3FK8PyJ3fJovwAW8NsR', function(err, res) {
	    console.log('first guess', res)
	});
	bcrypt.compare("veggies", '$2a$10$xChMvPzqG1O5irPDjfHUeO9KrysSsi4KS3FK8PyJ3fJovwAW8NsR', function(err, res) {
	    console.log('second guess', res)
	});*/
	//res.json('signin');
	if(req.body.email === database.users[0].email 
		&& req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}
})

app.post('/register',(req, res)=>{
	const { email, name, password} =req.body;
	db('users').insert({
		email:email,
		name:name,
		joined: new Date()
}).then(console.log)
	res.json(database.users[database.users.length-1]);
	{/*bcrypt.hash("password", null, null, function(err, hash) {
    	console.log(hash);
});*/}

	{/*database.users.push({
		      id:'125',
			  name:name,
			  email: email,
			  entries: 0,
			  joined: new Date()
	})*/}
	
})

app.get('/profile/:id', (req, res) =>{
	const {id}=req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if(!found){
		res.status(400).json('not found');
	}
})

//pour mettre à jour l’utilisateur afin d’augmenter
//' entrées' compter. Chaque fois qu’ils soumettent une image

app.put('/image',(req,res)=>{
	const {id} = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++
			return res.json(user.entries);
		}
	})
	if(!found){
		res.status(400).json('not found');
	}
})


app.listen(3000,()=>{
	console.log('app is running on port 3000');
})

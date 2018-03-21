const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const { User } = require('./models/user');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/auth' );

app.use(bodyParser.json());
app.use(cookieParser());


app.post('/api/user',(req,res) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password
	});
	user.save((error,doc) => {
		if ( error ) res.status(400).send(error);
		res.status(200).send(doc);
	})
})

app.post('/api/user/login',(req,res) => {

	User.findOne({'email': req.body.email}, (error,user) => {
		if ( ! user ) {
			res.json({message: 'Auth failed, user not found.'});
		} else {
			user.comparePassword(req.body.password,(error,isMatch) => {
				if ( error ) throw error;
				if ( ! isMatch ) return res.status(400).json({
					message: 'Wrong password.'
				})
				user.generateToken((error,user) => {
					if(error) {
						return res.status(400).send(error);
					} else {
						res.cookie('auth',user.token).send('ok');
					}
				});
			});
		}
	})
})

app.get('/user/profile',auth,(req,res)=>{
	res.status(200).send(req.token);
})

const port = process.env.PORT || 3000;

app.listen(port,() => {
	console.log(`Started on port ${port}`);
});
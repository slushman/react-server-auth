const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		required: true,
		minLength: 6
	},
	token: {
		type: String
	}
});

userSchema.pre('save',function(next){
	var user = this;

	if ( user.isModified('password') ) {
		bcrypt.genSalt(SALT_I, function (error, salt) {
			if (error) return next(error);

			bcrypt.hash(user.password, salt, function (error, hash) {
				if (error) return next(error);

				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}
})

userSchema.methods.comparePassword = function(candidatePassword,callback){
	bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
		if (error) throw callback(error);

		callback(null,isMatch);
	});
}

userSchema.methods.generateToken = function(callback) {
	var user = this;
	var token = jwt.sign(user._id.toHexString(),'supersecret');
	
	user.token = token;

	user.save(function(error,user){
		if (error) {
			return callback(error);
		} else {
			callback(null,user);
		}
	});
}

userSchema.statics.findByToken = function(token,callback){
	var user = this;
	jwt.verify(token,'supersecret',function(error,decode){
		user.findOne({'_id': decode, 'token': token}, function(error,user){
			if (error) {
				return callback(error);
			} else {
				callback(null,user);
			}
		})
	});

}

const User = mongoose.model('User', userSchema);

module.exports = { User }
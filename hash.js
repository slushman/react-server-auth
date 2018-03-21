const bcrypt = require('bcrypt');
const { MD5 } = require('crypto-js');
const jwt = require('jsonwebtoken');

// bcrypt.genSalt(10,(error,salt) => {
// 	if (error) return next(error);

// 	bcrypt.hash('password123',salt,(error,hash) => {
// 		if (error) return next(error);

// 		console.log(hash)
// 	})
// })

// const secret = 'mysecretpassword';
// const secretSalt = 'kbwdgadfjbsdfmbdajkfb';

// const user = {
// 	id: 1,
// 	token: MD5('password123').toString() + secretSalt
// }

// const receivedToken = '482c811da5d5b4bc6d497ffa98491e38kbwdgadfjbsdfmbdajkfb';

// if (user.token === receivedToken) {
// 	console.log('move forward')
// } else {
// 	console.log('Nope')
// }

// console.log(user)



const id = '1000';
const secret = 'supersecret';

const receivedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.L9PmEqLlZjettygguzj25agunJu6NkvVtG9RFRBnK2Y';

const token = jwt.sign(id,secret);
const decodeToken = jwt.verify(receivedToken,secret);

console.log(decodeToken)
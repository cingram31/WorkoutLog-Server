var router=require('express').Router();
var sequelize=require('../db.js');
var User=sequelize.import('../models/user');
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');


router.post('/', function(req, res){
	var username = req.body.user.username;
	var pass = req.body.user.password;   //TODO; hash this password-HASH=not human readable


	User.create({
		username: username,
		passwordhash: bcrypt.hashSync(pass, 10)  //TODO: make it hashed
	}).then(
			//Sequlize is going to return the object it created from db.
			function createSuccess(user){
				//successful get this:
				var token=jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
				res.json({
					user: user,
					message: 'created',
					sessionToken: token
				});

			},
			function createError(err){
				res.send(500, err.message);

			}
		);
});

module.exports=router;
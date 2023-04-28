const User = require("../model/User");
const Token = require("../model/Token");
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get All Users
const user_api = async (req, res) => {
    res.json([
        {
            "Endpoint": "/register/",
            "method": "POST",
            "body": {
                "username": "",
                "email": ""
            },
            "description": "Returns access token and refresh token after registering the user in data base"
        },
        {
            "Endpoint": "/login/",
            "method": "POST",
            "body": {
                "username": "already created username",
                "email": "email must be registered with the same username"
            },
            "description": "Returns refresh token and access token"
        },
        {
            "Endpoint": "/logout/",
            "method": "POST",
            "header":{
                "Authorization":"Bearer access_token"
            },
            "body": {
                "token":"your refresh token"
            },
            "description": "logout user from one device"
        },
        {
            "Endpoint": "/logout-all/",
            "method": "GET",
            "header":{
                "Authorization":"Bearer access_token"
            },
            "body": null,
            "description": "logout user across all of his devices"
        },
        {
            "Endpoint": "/generate-token/",
            "method": "POST",
            "body": {
                "token":"your refresh token"
            },
            "description": "Returns new access token by providing refresh token"
        },
        {
            "Endpoint": "/test/",
            "method": "GET",
            "header":{
                "Authorization":"Bearer access_token"
            },
            "body": null,
            "description": "Returns new access token by providing refresh token"
        }
    ])
};

// Register user
const register = async (req, res) => {
    const user = new User({
        username:req.body.username,
        email:req.body.email
    });
    try {
        var savedUser = await user.save();
    } catch (error) {
        res.json({ message: error, "error":"error while saving user in DB"});
    }

    const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET_KEY)
    const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {expiresIn: 300})
    const tokens = {accessToken, refreshToken}

    const tokenEntryData = new Token({
        "user":savedUser._id,
        "refresh_token":refreshToken
    })
    try {
        await tokenEntryData.save();
    } catch (error) {
        res.json({ message: error, "error":"error while saving token in DB"});
    }

    res.send(tokens);

};

// Logout user from one device
const logout = async (req, res) => {
    if(req.err){
        res.send(err)
    }else{
      try {
        const token = await Token.deleteOne({refresh_token:req.body.token});
        res.send(token);
      } catch (error) {
        res.status(400).send({"error":"Inavalid Token"});
      }
    }
};

// Logout from all devices
const logoutAll = async (req, res) => {
    if(req.err){
        res.send(req.err)
    }else{
      const token = await Token.deleteMany({user:req.user._id});
      res.send({token});
    }
};



// Generate new access token using refresh token
const generateToken = async (req, res) => {
    try {
        const validateToken = await Token.findOne({refresh_token:req.body.token});
        if(validateToken){
            await jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
                if (err) return res.sendStatus(403)
                // user.unique_key = crypto.randomBytes(4).toString('hex')
                const tokenUser = {
                    _id : user._id,
                    username: user.username,
                    email: user.email 
                }
                const new_token = jwt.sign(tokenUser, process.env.SECRET_KEY, {expiresIn: 300})
                res.send({token:new_token})
            })
            
        }
        else{
            res.send({"error":"Refresh Token Invalid"})
        }
      } catch (error) {
        res.json({ message: error, "error":"unable to generate new token" });
      }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({username:req.body.username, email:req.body.email});
        if(user){
            const accessToken = generateAccessToken(user.toJSON())
            const refreshToken = await generateRefreshToken(user.toJSON())
            req.user = user

            const tokens = {accessToken, refreshToken}
            res.send(tokens)
        }
        else{
            res.send({"error":"Invalid Credentials"})
        }
      } catch (error) {
        res.json({ message: error, "error":"unable to login, server error" });
      }
};


const testContent = async (req, res) => {
    if(req.err){
        res.send(req.err)
    }else{
    try {
        const token = await Token.find({user:req.user._id});
        const data = {"success":"protected content accessed", "user":req.user, "tokens":token}
        res.send(data)
      } catch (error) {
        res.json({ message: error, "error":"unable to fetch token data" });
      }
    }
};


module.exports = {
    user_api, 
    register, 
    logout, 
    logoutAll, 
    generateToken,
    testContent,
    login,
  }
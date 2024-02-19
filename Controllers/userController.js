// logic to register
//import userSchema
const users = require('../Models/userSchema');

// web token
const jwt = require('jsonwebtoken');
//register user

exports.register = async (req, res) => {
    console.log("Inside user conroller : register method");
    console.log("Request Body:", req.body);
    const { username, email, password } = req.body;
    //check whether email id is already exist in user collection
    try {
        const existingUser = await users.findOne({ email: email });
        console.log("existing user")
        console.log(existingUser)
        if (existingUser) {
            // if user already  registered by checking email
            res.status(406).json('Account already exists,please Login')
        }
        else {
            const newUser = new users({
                username: username,
                email: email,
                password: password,
                github: "",
                linkedin: "",
                profile: ""
            })
            await newUser.save();
            res.status(200).json(newUser);
        }
    }
    catch (err) {
        res.status(401).json("registration reqest failed due to ", err)
    }
}

// login

exports.login = async (req, res) => {
    console.log("Inside login method ");
    console.log("Request Body:", req.body);
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email: email, password: password });
        if (existingUser) {
            const token = jwt.sign({ userID: existingUser._id }, "supersecretkey1234") // generating json web token, token using user id& and set a password
            res.status(200).json({
                existingUser: existingUser,
                token: token
            })
            // console.log(token)
        }
        else {
            res.status(406).json("Invalid email id or Password")
        }
    }
    catch (err) {
        res.status(401).json("Login req failed due to ", err)
    }
}



exports.updateProfile = async (req, res) => {
    const userID = req.payload;
    const { github, linkedin,profile } = req.body
    const newProfile = req.file?req.file.filename:profile
    // console.log(userID)
    // console.log(req.body)
    // console.log(profile)
    try {
        const editProfile = await users.findByIdAndUpdate({_id:userID},{
            github:github,
            linkedin:linkedin,
            profile:newProfile
        },
        {
            new:true
        })
        await editProfile.save()
        res.status(200).json(editProfile);

    }
    catch (err) {

    }
}

exports.getUserProfile = async (req, res) => {
    const userID = req.payload; 

    try {
        const user = await users.findById(userID);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
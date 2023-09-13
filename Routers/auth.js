const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// user collecction schema
const User = require('../Model/userSchema')
// database connection
require('../DB/conn')
//middle ware for about page
const authenticate = require('../Middleware/authenticate')
const cookieParser = require('cookie-parser');
router.use(cookieParser());
// router.use(authenticate);




router.get('/', (req, res) => {
    res.send('Hello world from server')
})

//using async
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, work, password, cpassword } = req.body
        if (!name || !email || !phone || !work || !password || !cpassword) {
            return res.status(422).json({ error: "user donot fill all the fields " })
        }
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            console.log("user already registered")
            return res.status(423).json({ error: "user already registered" })

        }
        else if (password != cpassword) {
            console.log("password does not match")
            return res.status(422).json({ error: "password does not match" })
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword })
            //yahan py bcrypt/hash hoga password
            await user.save()
            console.log("user  registered")
            res.status(201).json({ message: "user registered successfully!" })
        }



    }
    catch (err) {
        console.log(err)
    }




})

//using promises
//         console.log(req.body)
//         console.log(req.body.name)
//         console.log(req.body)
//         res.json({message:req.body})

// const {name,email,phone,work,password,cpassword}=req.body

// if(!name||!email||!phone||!work||!password||!cpassword)
// {
//     return res.status(422).json({error:"user donot fill all the fields "})
// }
// User.findOne({email:email}).then((userExist)=>{
//     if(userExist){
//         return res.status(422).json({error:"user already registered"})
//     }


//     const user=new User({name,email,phone,work,password,cpassword})
//     user.save().then(()=>{
//         res.status(202).json({message:"user registered successfully!"})
//     }).catch((err)=>{
//         console.log("mnope")
//     }).catch(()=>{
//         console.log("nope")
//     })


router.post("/signin", async (req, res) => {
    console.log("login route")
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "user donot fill all the fields " })
        }
        const userLogin = await User.findOne({ email: email })
        // if(userLogin){
        //     res.status(202).json({message:"User login Successfully!"})
        // }
        // else{
        //     return res.status(401).json({error:"Please fill registeration form"}) 
        // }
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            const token = await userLogin.generateAuthToken()


            if (isMatch) {
                console.log('user login finally')
                res.send({ "jwtoken": token, message: "user login successfully" },
                )
                // res.status(202).json()
            }
            else {
                console.log('invalid credential ')
                res.status(402).json({ error: "Invalid Credential" })
            }
        }
        else {
            res.status(402).json({ error: "invalid. Please Enter correctly" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "invalid invalid" });
    }

})

router.get('/about', authenticate, (req, res) => {
    console.log("hello from about")
    res.send(req.rootUser)
})


router.get('/getUserData', authenticate, (req, res) => {
    console.log("hello from user data")
    res.send(req.rootUser)
})

// POST /contactUs - Send a message
router.post('/contactUs', authenticate, async (req, res) => {
    console.log("hello from contactUs");

    const { _id, message } = req.body;

    try {
        // Find the user based on the provided _id
        const messageUser = await User.findOne({ _id });

        if (!messageUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add the message to the user's messages array
        await messageUser.addMessage(message);

        // Optionally, you can send a response back to the client
        return res.status(202).json({ message: "Message sent successfully", messageUser });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


//logout
router.post('/logout', (req, res) => {
    console.log("hello from logout")
    res.send("455")
})





module.exports = router
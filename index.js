const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./Model/userSchema')
//DB conn
dotenv.config()
//connect backend to database
require('./DB/conn')
const cors = require('cors');
app.use(cors({
    origin: '*'
}));


app.use(express.json())
app.use(require('./Routers/auth'))




// const DB=process.env.DATABASE
const port = process.env.PORT || 6010

// mongoose.connect(DB,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// }).then(()=>{
//     console.log('connection successfull')
// }).catch((err)=>console.log('failed!'))





app.get('/', (req, res) => {
    res.send('Hello world from server')
})

app.get('/login', (req, res) => {
    res.send('Hello world from server login')
})
app.get('/register', (req, res) => {
    res.send('Hello world from server signup')
})
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})
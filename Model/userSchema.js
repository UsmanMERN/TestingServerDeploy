const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
work:{
    type:String,
    required:true
}
,
password:{
    type:String,
    required:true
},
cpassword:{
    type:String,
    required:true
},
date:{
type:Date,
default:Date.now
},
tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
],
messages:[
    {
        message:{
            type:String,
            required:true
        }
    }
]

})
 // this is a middleware when user fill registeration is is middleware that store user dat in hash form before save
userSchema.pre('save',async function (next){
    if (this.isModified('password')) {
        this.password=await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next()
})

//generating and storing token in database
userSchema.methods.generateAuthToken=async function(){
    try{
    let token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
    this.tokens=this.tokens.concat({token:token})
    
    await this.save()
    // console.log("this is my",token)
    return token
}
catch(err){
    console.log(err)
}

}
//add message in database
userSchema.methods.addMessage= async function(message){
    try{
this.messages=this.messages.concat({message})
await this.save()
return this.messages
    }
    catch(error){
        console.log("in storing message"+error)
    }
}


const User=mongoose.model('USERS',userSchema)
module.exports=User
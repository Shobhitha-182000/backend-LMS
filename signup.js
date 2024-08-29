const mongoose=require('mongoose')

const signupdata=new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
 
})

const signdata=mongoose.model("signups",signupdata)

module.exports=signdata;
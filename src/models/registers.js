const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const schema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  gender:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  tokens:[
    {
      token:{
        type: String,
    required: true,
      }
    }
  ]
  
});

 schema.methods.generateAuthToken = async function(){
  try {
    // console.log("_id is "+this._id)
   
      const usertoken =  jwt.sign({_id:this._id},process.env.SECRET_KEY)
      this.tokens = this.tokens.concat({token:usertoken})
      // console.log("token is pass "+ usertoken)
      await this.save();
      // console.log("token is passed")

      return usertoken;
      
  } catch (error) {
    // console.log("token error")
    throw error
  }
 }

schema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }

    next();
})


const Collection = new mongoose.model("Student",schema);

module.exports = Collection;
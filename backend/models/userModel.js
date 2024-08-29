const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ROLES = require("../utils/roles")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email: {
        type : String,
        required : true,
        unique : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please add a valid email structure"]
    },
    password: {
        type : String,
        required : true,
        select : false
    },
    age: {
        type : Number,
        required : true,
        min: [0, "Age cannot be negative"],
    },
    role : {
        type : String ,
        required : true ,
        role: { type: String, required: true, enum: Object.values(ROLES) },
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isInstructor : {
        type : Boolean,
        default : false
    },
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'parents' },
    resetPasswordToken : String ,
    resetPasswordExpire : Date ,
},{timestamps : true})




userSchema.methods.signJWT = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE})
}


userSchema.pre("save" , async function(next){

    if(!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword
 
})



userSchema.methods.getResetPasswordToken = function(){
    // create a token
    // .randomBytes(num_of_bytes) return a Buffer then we convert it to string
    const resetToken = crypto.randomBytes(20).toString("hex")

    // set the user resetPasswordToken key in the DB to the created token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex") 

    // set the reset token expire date (10 min)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}



const User = mongoose.model("users" , userSchema)


module.exports = User
const mongoose = require("mongoose")


const ticketSchema = new mongoose.Schema({
    regarding: {
        type : String ,
        required : true,
        enum : ["content" , "technical"]
    },
    subject : {
        type : String ,
        required : true
    },
    details : {
        type : String ,
        required : true
    },
    info : {
        type : String ,
        required : true
    },
    userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
    status : {
        type : String ,
        required : true,
        enum : ["pending" , "inProgress" , "closed"],
        default : "pending"
    },
    supportTeamResponse : {
        type : String ,
    }
},{timestamps : true})



const Ticket = mongoose.model("tickets" , ticketSchema)


module.exports = Ticket
const mongoose = require("mongoose")


const ParentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email structure"],
    },
    userObjRef : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true},
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'students' }]
});


ParentSchema.virtual('user', {
    ref: 'users',
    localField: 'userObjRef',
    foreignField: '_id',
    justOne: true
});


const Parent = mongoose.model("parents" , ParentSchema)


module.exports = Parent
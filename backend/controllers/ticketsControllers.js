const Ticket = require("../models/ticketModel")
const Joi = require("joi");
const User = require("../models/userModel");
const createError = require("../utils/createError");



const getAllUserTickets = async (req , res , next) => {

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next(createError("User does not exist", 400));
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const skip = (page - 1) * limit;

        let userTickets = await Ticket.find({ userObjRef: user._id })
            .skip(skip)
            .limit(limit);

        userTickets = userTickets.filter(ticket => ticket !== undefined && ticket !== null);

        res.status(200).json(userTickets);

    } catch (error) {
        next(error);
    }
}




const addNewTicket = async (req , res , next) => {

    const ticketSchema = Joi.object({
        regarding : Joi.string().valid("content" , "technical").required(),
        subject : Joi.string().required(),
        details : Joi.string().required(),
        info : Joi.string().required(),
    })

    const { value, error } = ticketSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return next(createError("Inavlid Ticket Credentials" , 500));
    }


    try {
        
        const {regarding , subject , details , info} = value

        if(!regarding || !subject || !details || !info) { 
            return next(createError("Invalid Ticket Credentials" , 400))
        }

        const newTicket = new Ticket({
            regarding,
            subject ,
            details,
            info ,
            userObjRef : req.user._id
        })

        await newTicket.save()

        res.status(201).json(newTicket)

    } catch (error) {
        next(error)
    }
}





const deleteTicket = async (req , res , next) => {

    try {
        
        const {ticketId} = req.params

        let ticket = await Ticket.findById(ticketId)

        if(!ticket){
            return next(createError("given Ticket not exist" , 404))
        }

        if(ticket.userObjRef.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return next(createError("you don't have access to delete this ticket" , 401))
        }

        await Ticket.findByIdAndDelete(ticket._id)

        res.status(200).json({msg : "ticket deleted successfully"})

    } catch (error) {
        next(error)
    }
}




module.exports = {
    getAllUserTickets , 
    addNewTicket , 
    deleteTicket
}
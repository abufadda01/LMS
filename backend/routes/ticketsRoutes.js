const {Router} = require("express")

const {protectRoutes} = require("../middlewares/auth")

const {
    getAllUserTickets , 
    addNewTicket , 
    deleteTicket
} = require("../controllers/ticketsControllers")


const router = Router()


router.get("/" , protectRoutes , getAllUserTickets)

router.post("/new-ticket" , protectRoutes , addNewTicket)

router.delete("/delete-ticket/:ticketId" , protectRoutes , deleteTicket)


module.exports = router
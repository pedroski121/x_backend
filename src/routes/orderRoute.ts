import express from 'express';
import { body } from 'express-validator';
import { addNewOrder , getAllOrders, updateOrder, deleteOrder} from '../controllers/orderController';
import { currentUser } from '../middlewares/current-user';

const router = express.Router()

router.get("/api/order/all",getAllOrders )


router.post('/api/order/add',
currentUser, 
body(["userID"]).notEmpty().isString(),
body(["referenceID"]).notEmpty().isString(),
body(["pickUpStationID"]).notEmpty().isString(),
body(["orderInitiationTime"]).notEmpty().isString(),
body(["pendingDate"]).isString(),

addNewOrder)


router.patch("/api/order/update", 
body(["currentStatus"]).isString().notEmpty(), 
 
body(["orderID"]).isString().notEmpty(), 


updateOrder)


router.delete("/api/order/delete",
body(["orderID"]).isString().notEmpty(), 
deleteOrder)



export {router as orderRoutes}
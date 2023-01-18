import express ,{Request, Response, NextFunction} from 'express';
import { currentUser } from '../../middlewares/current-user';
const router = express.Router();

router.get('/api/user/current-user',currentUser,(req:Request,res:Response)=>{
    if(req.currentUser){
        res.send([{currentUser:req.currentUser}]);
    } 
    else {
        res.send([{currentUser:null}])
    };
})
export {router as getCurrentUser} 
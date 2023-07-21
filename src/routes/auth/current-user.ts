import express ,{Request, Response, NextFunction} from 'express';
import { currentUser } from '../../middlewares/current-user';
const router = express.Router();

router.get('/api/auth/current-user',currentUser,(req:Request,res:Response)=>{
    if(req.currentUser){
        res.send([{...req.currentUser, success:true}]);
    } 
    else {
        res.send([{currentUser:null, success:false}])
    };
})
export {router as getCurrentUser} 
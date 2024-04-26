import express from 'express'
import { body, check } from 'express-validator';
import { addLogisticsCompanyLocation, getLogisticsCompanyLocations, getLogisticsCompanyLocationsInState, getPickUpStation } from '../controllers/logisticsCompanyLocationController';

const router = express.Router();

router.post('/api/logistics-company-locations/add',
body(["logisticsCompany"]).notEmpty().isString().custom((value)=>{
    return value === "GIGL" || value === "GAVICE"
}), 
body(["state"]).notEmpty().isString(),body(["city"]).notEmpty().isString(),
body(["address"]).notEmpty().isString(), addLogisticsCompanyLocation)

router.get('/api/logistics-company-locations/all', getLogisticsCompanyLocations) 
router.get('/api/logistics-company-locations/:state', getLogisticsCompanyLocationsInState)
router.get('/api/pick-up-station/:id', getPickUpStation)

export {router as logisticsCompanyLocationRoutes}

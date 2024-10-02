import express, {Request, Response} from "express";
import { Product } from "../models/product-model";

const router = express.Router();

router.get("/search",async (req:Request, res:Response)=>{
    try {
        const { q } = req.query;
        const results = await Product.find(
          { $text: { $search: `${q}` },
          quantity: { $gt: 0 }},
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" }});
        res.json(results);
      } catch (error) {
        res.status(500).json({ message: 'Error performing search', error });
      }
})






export {router as search} 
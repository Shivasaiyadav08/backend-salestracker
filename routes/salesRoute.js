import { getdata, undorecentSale, addsale } from "../controllers/salesController.js";
import express from "express";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect)


// Fetch sales by date (from URL param)
router.get("/:date", getdata);

// Add a new sale
router.post("/addsale", addsale);

// Undo the most recent sale
router.delete("/undo", undorecentSale);

export default router;

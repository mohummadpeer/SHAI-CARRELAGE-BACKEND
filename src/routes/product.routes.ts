import { Router } from "express";
import { addProduct, getProducts, validateProduct } from "../controllers/product.controller";

const router = Router();

router.post("/", validateProduct, addProduct);
router.get("/", getProducts);

export default router;
import { Router } from "express";
import { addProduct, getProducts } from "../controllers/product.controller";

const router = Router();

// Ajouter un produit
router.post("/", addProduct);

// Récupérer tous les produits
router.get("/", getProducts);

export default router;

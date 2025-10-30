import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

// ✅ Middleware de validation
export const validateProduct = [
  body("name").isString().notEmpty(),
  body("price").isNumeric(),
  body("stock").isInt({ min: 0 }),
  body("description").isString().notEmpty(),
  (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


// ➕ Ajouter un produit
export const addProduct = async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const newProduct = productRepo.create(req.body);
    await productRepo.save(newProduct);

    res.status(201).json({
      message: "✅ Produit ajouté avec succès !",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// 📦 Récupérer tous les produits
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

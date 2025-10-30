import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

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

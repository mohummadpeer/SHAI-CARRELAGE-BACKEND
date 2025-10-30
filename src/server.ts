import "reflect-metadata";

import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { AppDataSource } from "./data-source";
import productRoutes from "./routes/product.routes";


dotenv.config();


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// ✅ Configuration CORS pour autoriser ton frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000", // pour le dev local
      "https://shai-carrelage.vercel.app", // ⚠️ remplace par ton vrai domaine Vercel (frontend)
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// 🛡️ Sécurité HTTP
app.use(helmet({
  crossOriginResourcePolicy: false, // autorise les images cross-origin
}));

// 🚦 Limiteur de requêtes (protège contre le spam / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


// ✅ Connexion à la base
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connexion à la base de données réussie !");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base :", err);
  });




// Routes
app.use("/products", productRoutes);

// Test route
app.get("/", (_req, res) => res.send("👋 Backend de Shai Carrelage"));







      // 🧠 Route pour créer une session Stripe Checkout
      app.post("/create-checkout-session", async (req, res) => {
        const { cartItems } = req.body;

        if (!cartItems || !Array.isArray(cartItems)) {
          return res.status(400).json({ error: "cartItems manquant ou invalide" });
        }

        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: cartItems.map((item) => ({
              price_data: {
                currency: "eur",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: item.quantity,
            })),
            // ✅ URLs dynamiques selon l’environnement
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
          });

          res.json({ url: session.url });
        } catch (error: any) {
          console.error("Erreur Stripe:", error.message);
          res.status(500).json({ error: error.message });
        }
      });




// Lancement du serveur
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));



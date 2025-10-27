import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 🔑 Stripe avec clé secrète depuis .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Configuration CORS pour autoriser ton frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000", // pour les tests locaux
      "https://ton-site.vercel.app", // ⚠️ remplace par ton vrai domaine Vercel
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

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
      success_url:
        process.env.FRONTEND_URL + "/success",
      cancel_url:
        process.env.FRONTEND_URL + "/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Port automatique pour Render
const PORT = process.env.PORT || 4242;
app.listen(PORT, () =>
  console.log(`✅ Server Stripe en écoute sur port ${PORT}`)
);


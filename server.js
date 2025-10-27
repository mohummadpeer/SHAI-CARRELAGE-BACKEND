import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// 🧠 Route pour créer une session Stripe Checkout
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body; // 👈 destructuration

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
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`✅ Server Stripe en écoute sur port ${PORT}`));

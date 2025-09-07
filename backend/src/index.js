import express from "express";
import Stripe from "stripe";
import cors from "cors";
import { environment } from "./environment.js";

const app = express();
const stripe = new Stripe(environment.SECRET_KEY_API_STRIPE); 

app.use(cors({ origin: "*" }));

app.use(express.json()); 

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: "Ingresso Festa" },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://organic-trout-9r45jrpgx69cx7p9-4200.app.github.dev/sucesso",
      cancel_url: "https://organic-trout-9r45jrpgx69cx7p9-4200.app.github.dev/cancelado",
    });

    res.json({ url: session.url }); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, "0.0.0.0", () => console.log("Servidor rodando na porta 4242"));
